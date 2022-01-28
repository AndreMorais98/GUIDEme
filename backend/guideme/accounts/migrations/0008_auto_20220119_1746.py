# Generated by Django 3.2.9 on 2022-01-19 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_alter_user_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='header_pic',
            field=models.URLField(default='https://i.imgur.com/ExjELDm.jpg', verbose_name='header pic'),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_pic',
            field=models.URLField(default='https://i.kym-cdn.com/entries/icons/original/000/017/618/pepefroggie.jpg', verbose_name='profile pic'),
        ),
    ]
