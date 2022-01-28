# Generated by Django 3.2.9 on 2021-12-29 17:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0001_initial'),
        ('accounts', '0003_auto_20211205_1616'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='guide',
            options={'verbose_name': 'guide', 'verbose_name_plural': 'guides'},
        ),
        migrations.AddField(
            model_name='guide',
            name='plan_expire_date',
            field=models.DateField(blank=True, null=True, verbose_name='plan_expire_date'),
        ),
        migrations.AddField(
            model_name='guide',
            name='subscription_plan',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subscribers', to='subscriptions.subscriptionplan'),
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(db_index=True, max_length=254, unique=True, verbose_name='email address'),
        ),
    ]
