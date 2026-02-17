#!/usr/bin/env python3
"""Import CSV files exported by `export_db_to_csv.py` into the Django database.

Behavior:
- By default finds the most recent directory under `backups/` next to this script.
- Reads CSV files named `<app_label>_<model_name>.csv` and imports rows.
- Two-pass import:
  1) Create/update instances with non-relational fields (and store PK if provided).
  2) Resolve FK and M2M relations and apply them.

Usage:
  python import_csv_to_db.py [--source PATH]

Note: Run from the repo root or anywhere; the script sets up Django.
"""
from __future__ import annotations
import os
import sys
import csv
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

# Make project importable
BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_projects.settings')
import django
django.setup()

from django.apps import apps
from django.db import transaction
from django.db.models import Model


def find_latest_backup(base: Path) -> Path | None:
    backups = base / 'backups'
    if not backups.exists():
        return None
    candidates = [p for p in backups.iterdir() if p.is_dir()]
    if not candidates:
        return None
    return max(candidates, key=lambda p: p.name)


def parse_csv_file(path: Path) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []
    with path.open('r', encoding='utf-8') as fh:
        reader = csv.DictReader(fh)
        for r in reader:
            rows.append(r)
    return rows


def coerce_value(raw: str):
    if raw == '' or raw is None:
        return None
    # Try JSON decode for lists/dicts
    try:
        return json.loads(raw)
    except Exception:
        return raw


def import_from_folder(source: Path):
    # Collect CSV files
    csv_files = sorted([p for p in source.glob('*.csv')])
    if not csv_files:
        print(f'No CSV files found in {source}')
        return

    # Read all CSV into memory first
    data_store: Dict[str, List[Dict[str, str]]] = {}
    for csv_file in csv_files:
        data_store[csv_file.name] = parse_csv_file(csv_file)

    # First pass: create/update instances without setting relational fields
    created_counts: Dict[str, int] = {}

    for filename, rows in data_store.items():
        name = filename.rsplit('.', 1)[0]
        if '_' not in name:
            print(f"Skipping unexpected file name: {filename}")
            continue
        app_label, model_name = name.split('_', 1)
        model = apps.get_model(app_label, model_name)
        if model is None:
            print(f"Model {app_label}.{model_name} not found, skipping {filename}")
            continue

        # Skip apps not inside the project folder (developer-only import)
        try:
            Path(model._meta.apps.get_app_config(app_label).path).resolve().relative_to(BASE.resolve())
        except Exception:
            print(f"Skipping {app_label} (not a developer app)")
            continue

        created = 0
        concrete_fields = {f.name: f for f in model._meta.concrete_fields}
        m2m_field_names = {f.name for f in model._meta.many_to_many}

        for row in rows:
            pk_name = model._meta.pk.name
            pk_val_raw = row.get(pk_name, '')
            pk_val = coerce_value(pk_val_raw)

            # Build kwargs for non-relational concrete fields (exclude M2M)
            obj_kwargs: Dict[str, Any] = {}
            for col, raw in row.items():
                if col in m2m_field_names:
                    continue
                field = concrete_fields.get(col)
                if not field:
                    # ignore unknown columns
                    continue

                # If field is FK/OneToOne relation, skip for pass 1
                if field.is_relation and field.remote_field is not None:
                    continue

                val = coerce_value(raw)
                obj_kwargs[col] = val

            with transaction.atomic():
                instance = None
                if pk_val is not None:
                    try:
                        instance = model.objects.get(pk=pk_val)
                        for k, v in obj_kwargs.items():
                            setattr(instance, k, v)
                        instance.save()
                    except model.DoesNotExist:
                        # create with provided pk when possible
                        create_kwargs = dict(obj_kwargs)
                        create_kwargs[pk_name] = pk_val
                        instance = model.objects.create(**create_kwargs)
                else:
                    instance = model.objects.create(**obj_kwargs)

                created += 1

        created_counts[f"{app_label}.{model_name}"] = created

    # Second pass: set FK and M2M relationships
    for filename, rows in data_store.items():
        name = filename.rsplit('.', 1)[0]
        if '_' not in name:
            continue
        app_label, model_name = name.split('_', 1)
        model = apps.get_model(app_label, model_name)
        if model is None:
            continue

        try:
            Path(model._meta.apps.get_app_config(app_label).path).resolve().relative_to(BASE.resolve())
        except Exception:
            continue

        concrete_fields = {f.name: f for f in model._meta.concrete_fields}
        m2m_fields = {f.name: f for f in model._meta.many_to_many}

        for row in rows:
            pk_name = model._meta.pk.name
            pk_val_raw = row.get(pk_name, '')
            pk_val = coerce_value(pk_val_raw)

            try:
                if pk_val is not None:
                    instance = model.objects.get(pk=pk_val)
                else:
                    # If no pk provided try to match a unique field - fallback: skip
                    print(f"Skipping row without PK for {app_label}.{model_name}")
                    continue
            except model.DoesNotExist:
                print(f"Instance with pk={pk_val} for {app_label}.{model_name} not found in second pass")
                continue

            with transaction.atomic():
                # Handle FK/OneToOne fields
                for col, raw in row.items():
                    field = concrete_fields.get(col)
                    if not field:
                        continue
                    if field.is_relation and field.remote_field is not None and not field.many_to_many:
                        rel_model = field.remote_field.model
                        rel_pk = coerce_value(raw)
                        if rel_pk is None:
                            setattr(instance, col, None)
                        else:
                            try:
                                rel_obj = rel_model.objects.get(pk=rel_pk)
                                setattr(instance, col, rel_obj)
                            except Exception:
                                # leave for later / or skip if missing
                                print(f"Related object {rel_model} pk={rel_pk} not found for {app_label}.{model_name}.{col}")
                instance.save()

                # Handle M2M
                for m2m_name, m2m_field in m2m_fields.items():
                    raw = row.get(m2m_name, '')
                    if raw is None or raw == '':
                        continue
                    # stored as semicolon-separated pks
                    pks = [p for p in raw.split(';') if p != '']
                    try:
                        related_model = m2m_field.remote_field.model
                        related_qs = related_model.objects.filter(pk__in=pks)
                        getattr(instance, m2m_name).set(related_qs)
                    except Exception as e:
                        print(f"Failed to set m2m {m2m_name} for {instance}: {e}")

    print('Import completed. Created/updated counts per model:')
    for k, v in created_counts.items():
        print(f' - {k}: {v}')


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('--source', '-s', help='Path to backup folder (contains CSVs). If omitted uses latest under backups/')
    args = parser.parse_args()

    if args.source:
        source = Path(args.source)
        if not source.exists():
            print(f'Source {source} does not exist')
            return
    else:
        latest = find_latest_backup(BASE)
        if latest is None:
            print('No backups found')
            return
        source = latest

    print(f'Importing CSVs from: {source}')
    import_from_folder(source)


if __name__ == '__main__':
    main()
