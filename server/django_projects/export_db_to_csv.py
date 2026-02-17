#!/usr/bin/env python3
"""Export all database models to CSV files.

Creates a timestamped directory `backups/<YYYYMMDD_HHMMSS>/` next to this script
and writes one CSV per model named `<app_label>_<model_name>.csv`.

Usage:
  python export_db_to_csv.py

Run from anywhere; the script adjusts sys.path so Django settings load correctly.
"""
import os
import sys
import csv
import json
from pathlib import Path
from datetime import datetime

# Ensure project root (parent of this file) is on sys.path so the project package
# `django_projects` can be imported regardless of current working dir.
BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE.parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_projects.settings')
import django
django.setup()

from django.apps import apps


def serialize_value(val):
    if val is None:
        return ''
    if isinstance(val, (list, dict)):
        return json.dumps(val, default=str, ensure_ascii=False)
    if hasattr(val, 'pk'):
        return str(val.pk)
    try:
        return str(val)
    except Exception:
        return json.dumps(val, default=str, ensure_ascii=False)


def export_all_csv(output_root=None):
    if output_root is None:
        output_root = BASE / 'backups'
    output_root = Path(output_root)
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    out_dir = output_root / ts
    out_dir.mkdir(parents=True, exist_ok=True)

    # Only export models belonging to developer apps inside the project folder.
    # This excludes Django built-in and third-party apps whose files live
    # outside the django_projects folder (e.g., site-packages).
    for app_config in apps.get_app_configs():
        try:
            Path(app_config.path).resolve().relative_to(BASE.resolve())
        except Exception:
            # app is not inside the project folder
            continue

        for model in app_config.get_models():
            app_label = model._meta.app_label
            model_name = model._meta.model_name

            concrete_fields = list(model._meta.concrete_fields)
            m2m_fields = list(model._meta.many_to_many)

            headers = [f.name for f in concrete_fields] + [f.name for f in m2m_fields]

            file_path = out_dir / f"{app_label}_{model_name}.csv"
            with file_path.open('w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(headers)

                qs = model.objects.all().iterator()
                for obj in qs:
                    row = []
                    for f in concrete_fields:
                        val = getattr(obj, f.name)
                        # For FK/OneToOne store related pk rather than full repr.
                        if hasattr(val, 'pk'):
                            val = val.pk
                        row.append(serialize_value(val))

                    for f in m2m_fields:
                        try:
                            related_ids = list(getattr(obj, f.name).values_list('pk', flat=True))
                            row.append(';'.join(str(x) for x in related_ids))
                        except Exception:
                            row.append('')

                    writer.writerow(row)

    return out_dir


if __name__ == '__main__':
    target = export_all_csv()
    print(f"Exported CSVs to: {target}")
