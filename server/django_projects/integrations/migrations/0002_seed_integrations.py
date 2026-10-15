from django.db import migrations


INTEGRATIONS = [
    {
        'key': 'render',
        'name': 'Render',
        'category': 'Deployment',
        'description': 'Deploy and manage **backend services**.',
        'website_url': 'https://render.com',
        'dashboard_url': 'https://dashboard.render.com',
        'docs_url': 'https://render.com/docs',
        'logo_url': 'https://cdn.simpleicons.org/render/46E3B7',
        'fields': [
            {'id': 'serviceId', 'label': 'Service ID', 'helperText': 'Find the service identifier in the Render service settings.', 'type': 'text', 'required': True, 'secret': False},
            {'id': 'serviceUrl', 'label': 'Service URL', 'helperText': 'The public base URL of the deployed backend service.', 'type': 'url', 'required': False, 'secret': False},
            {'id': 'apiKey', 'label': 'API key', 'helperText': 'Use a Render API key with access to this service.', 'type': 'password', 'required': True, 'secret': True},
        ],
    },
    {
        'key': 'supabase',
        'name': 'Supabase',
        'category': 'Database',
        'description': 'Database, authentication, and storage for your application.',
        'website_url': 'https://supabase.com',
        'dashboard_url': 'https://supabase.com/dashboard',
        'docs_url': 'https://supabase.com/docs',
        'logo_url': 'https://cdn.simpleicons.org/supabase/3FCF8E',
        'fields': [
            {'id': 'projectUrl', 'label': 'Project URL', 'helperText': 'Copy the project URL from Supabase project settings.', 'type': 'url', 'required': True, 'secret': False},
            {'id': 'projectRef', 'label': 'Project reference', 'helperText': 'The short project reference shown in the Supabase dashboard URL.', 'type': 'text', 'required': True, 'secret': False},
            {'id': 'anonKey', 'label': 'Anon key', 'helperText': 'The public anon key used by your client application.', 'type': 'password', 'required': True, 'secret': True},
            {'id': 'serviceRoleKey', 'label': 'Service role key', 'helperText': 'A privileged server-side key. Never expose it in client code.', 'type': 'password', 'required': False, 'secret': True},
        ],
    },
    {
        'key': 'vercel',
        'name': 'Vercel',
        'category': 'Deployment',
        'description': 'Build, preview, and deploy **frontend applications**.',
        'website_url': 'https://vercel.com',
        'dashboard_url': 'https://vercel.com/dashboard',
        'docs_url': 'https://vercel.com/docs',
        'logo_url': 'https://cdn.simpleicons.org/vercel/FFFFFF',
        'fields': [
            {'id': 'team', 'label': 'Team or account', 'helperText': 'The Vercel team slug or account that owns the project.', 'type': 'text', 'required': False, 'secret': False},
            {'id': 'projectId', 'label': 'Project ID', 'helperText': 'Find this identifier in the Vercel project settings.', 'type': 'text', 'required': True, 'secret': False},
            {'id': 'deploymentUrl', 'label': 'Deployment URL', 'helperText': 'The production URL for this frontend deployment.', 'type': 'url', 'required': False, 'secret': False},
            {'id': 'token', 'label': 'Access token', 'helperText': 'A Vercel token authorized to access this project.', 'type': 'password', 'required': True, 'secret': True},
        ],
    },
    {
        'key': 'resend',
        'name': 'Resend',
        'category': 'Email',
        'description': 'Send transactional email from your application.',
        'website_url': 'https://resend.com',
        'dashboard_url': 'https://resend.com/overview',
        'docs_url': 'https://resend.com/docs',
        'logo_url': 'https://cdn.simpleicons.org/resend/FFFFFF',
        'fields': [
            {'id': 'fromEmail', 'label': 'From email', 'helperText': 'A verified sender address configured in Resend.', 'type': 'text', 'required': True, 'secret': False},
            {'id': 'apiKey', 'label': 'API key', 'helperText': 'Create an API key in the Resend dashboard.', 'type': 'password', 'required': True, 'secret': True},
        ],
    },
    {
        'key': 'github',
        'name': 'GitHub',
        'category': 'Source control',
        'description': 'Connect repositories and source code.',
        'website_url': 'https://github.com',
        'dashboard_url': 'https://github.com',
        'docs_url': 'https://docs.github.com',
        'logo_url': 'https://cdn.simpleicons.org/github/FFFFFF',
        'fields': [
            {'id': 'repositoryUrl', 'label': 'Repository URL', 'helperText': 'The HTTPS or SSH URL for the project repository.', 'type': 'url', 'required': True, 'secret': False},
            {'id': 'owner', 'label': 'Owner or organization', 'helperText': 'The GitHub username or organization that owns the repository.', 'type': 'text', 'required': False, 'secret': False},
            {'id': 'token', 'label': 'Personal access token', 'helperText': 'Optional token for private repository access.', 'type': 'password', 'required': False, 'secret': True},
        ],
    },
    {
        'key': 'aws',
        'name': 'AWS',
        'category': 'Cloud services',
        'description': 'Cloud infrastructure and managed services from **Amazon Web Services**.',
        'website_url': 'https://aws.amazon.com',
        'dashboard_url': 'https://console.aws.amazon.com',
        'docs_url': 'https://docs.aws.amazon.com',
        'logo_url': 'https://cdn.simpleicons.org/amazonaws/FF9900',
        'fields': [
            {'id': 'region', 'label': 'Region', 'helperText': "The AWS region where the project's resources are deployed.", 'type': 'text', 'required': True, 'secret': False},
            {'id': 'accessKeyId', 'label': 'Access key ID', 'helperText': 'The identifier from your AWS IAM access key pair.', 'type': 'text', 'required': True, 'secret': False},
            {'id': 'secretAccessKey', 'label': 'Secret access key', 'helperText': 'The secret paired with the AWS access key ID.', 'type': 'password', 'required': True, 'secret': True},
        ],
    },
    {
        'key': 'stripe',
        'name': 'Stripe',
        'category': 'Payments',
        'description': 'Accept and manage online payments.',
        'website_url': 'https://stripe.com',
        'dashboard_url': 'https://dashboard.stripe.com',
        'docs_url': 'https://docs.stripe.com',
        'logo_url': 'https://cdn.simpleicons.org/stripe/635BFF',
        'fields': [
            {'id': 'publishableKey', 'label': 'Publishable key', 'helperText': 'The Stripe publishable key used by client-side integrations.', 'type': 'text', 'required': True, 'secret': False},
            {'id': 'secretKey', 'label': 'Secret key', 'helperText': 'The Stripe secret key used only by server-side code.', 'type': 'password', 'required': True, 'secret': True},
        ],
    },
]


def seed_integrations(apps, schema_editor):
    Integration = apps.get_model('integrations', 'Integration')
    for integration_data in INTEGRATIONS:
        Integration.objects.update_or_create(
            key=integration_data['key'],
            defaults=integration_data,
        )


def remove_integrations(apps, schema_editor):
    Integration = apps.get_model('integrations', 'Integration')
    Integration.objects.filter(key__in=[item['key'] for item in INTEGRATIONS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('integrations', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_integrations, remove_integrations),
    ]