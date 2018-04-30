from django.db import models

class Artist(models.Model):
    rank = models.IntegerField(unique=True, null=True)
    href = models.CharField(max_length=200, null=True, default='none')
    img = models.CharField(max_length=200, null=True, default='none')
    last_week = models.IntegerField(unique=True, null=True)
    weeks_on_chart = models.IntegerField(unique=False, null=True)
    peak_position = models.IntegerField(unique=False, null=True)
    name = models.CharField(max_length=50, default='none')
