# Generated by Django 3.2.9 on 2022-01-18 21:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_guide_plan_expire_date'),
        ('experiences', '0004_auto_20220118_1952'),
    ]

    operations = [
        migrations.AddField(
            model_name='experience',
            name='participants_limit',
            field=models.IntegerField(default=10, verbose_name='participants_limit'),
        ),
        migrations.AlterField(
            model_name='experience',
            name='guide',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='experiences', to='accounts.guide'),
        ),
    ]
