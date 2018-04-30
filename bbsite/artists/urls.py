from django.urls import path

from . import views

# app_name = 'artists'
urlpatterns = [
    path('', views.index, name='index'),
    # ex: /polls/5/
    path('<int:artist_id>/', views.info, name='info'),
    path('api/', views.api, name='api'),
]
