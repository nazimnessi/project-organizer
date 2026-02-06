# Django Projects App

A Django app with models for Projects, Features, Bugs, Improvements, and Activities, matching the original Drizzle/Express schema.

## Setup

1. Create and activate a Python virtualenv:

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set environment variables (or use a `.env` file):

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/dbname
export DJANGO_SECRET_KEY=your-secret-key
export DJANGO_DEBUG=1
```

4. Run migrations:

```bash
python manage.py migrate
```

5. Start the development server:

```bash
python manage.py runserver 0.0.0.0:8000
```

## API Endpoints

- `GET /api/projects/` — List user's projects
- `GET /api/projects/<id>/` — Get project details
- `GET /api/projects/<id>/features/` — List features for project
- `GET /api/projects/<id>/bugs/` — List bugs for project
- `GET /api/projects/<id>/improvements/` — List improvements for project
- `GET /api/projects/<id>/activities/` — List activities for project

## Admin

Access the Django admin at `/admin` to manage models via UI.

## Models

- **User** — Auth user (id, email, name, profile image, etc.)
- **Project** — Project details with links and markdown fields
- **Feature** — Feature tracking with status and priority
- **Bug** — Bug tracking with status and priority
- **Improvement** — Improvement suggestions with status and priority
- **Activity** — Activity log for audit trail
