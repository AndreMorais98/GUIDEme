# Generated by Django 3.2.9 on 2022-01-18 22:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiences', '0005_auto_20220118_2153'),
    ]

    operations = [
        migrations.RenameField(
            model_name='experienceticket',
            old_name='participants',
            new_name='participant',
        ),
        migrations.AlterField(
            model_name='experience',
            name='participants_limit',
            field=models.IntegerField(default=10, verbose_name='participants limit'),
        ),
    ]
