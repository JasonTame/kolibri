# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-02-21 19:15
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import kolibri.core.fields
import kolibri.utils.time


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lesson',
            old_name='name',
            new_name='title',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='is_archived',
        ),
        migrations.AddField(
            model_name='lesson',
            name='date_created',
            field=kolibri.core.fields.DateTimeTzField(default=kolibri.utils.time.local_now, editable=False),
        ),
        migrations.AlterField(
            model_name='lessonassignment',
            name='lesson',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lesson_assignments', to='lessons.Lesson'),
        ),
    ]
