# Generated by Django 2.2 on 2020-04-18 10:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cmdb', '0032_auto_20200418_1811'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rack',
            name='idc',
            field=models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='cmdb.IDC', verbose_name='所属机房'),
        ),
        migrations.AlterField(
            model_name='server',
            name='rack',
            field=models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='cmdb.RACK', verbose_name='所属机柜'),
        ),
    ]
