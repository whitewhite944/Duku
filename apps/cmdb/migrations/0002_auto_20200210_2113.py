# Generated by Django 2.2 on 2020-02-10 13:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cmdb', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='idc',
            table='idc',
        ),
        migrations.AlterModelTable(
            name='rack',
            table='rack',
        ),
        migrations.AlterModelTable(
            name='server',
            table='server',
        ),
    ]
