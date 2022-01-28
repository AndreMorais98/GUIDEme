# Generated by Django 3.2.9 on 2021-12-05 16:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20211124_1704'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='is_guide',
        ),
        migrations.CreateModel(
            name='Guide',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='guide_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
    ]
