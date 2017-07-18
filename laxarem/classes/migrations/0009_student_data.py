# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-27 17:20
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0008_remove_student_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='data',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=1),
            preserve_default=False,
        ),
    ]