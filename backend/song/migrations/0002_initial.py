# Generated by Django 5.2.1 on 2025-05-19 21:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('song', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlist',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playlists', to='user.customer'),
        ),
        migrations.AddField(
            model_name='song',
            name='artists',
            field=models.ManyToManyField(related_name='songs', to='user.artist'),
        ),
        migrations.AddField(
            model_name='song',
            name='genres',
            field=models.ManyToManyField(related_name='songs', to='song.genre'),
        ),
        migrations.AddField(
            model_name='song',
            name='playlists',
            field=models.ManyToManyField(blank=True, related_name='songs', to='song.playlist'),
        ),
    ]
