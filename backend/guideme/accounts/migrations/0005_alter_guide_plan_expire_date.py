# Generated by Django 3.2.9 on 2021-12-29 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20211229_1754'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guide',
            name='plan_expire_date',
            field=models.DateField(blank=True, null=True, verbose_name='plan expire date'),
        ),
    ]
