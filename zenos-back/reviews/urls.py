from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.current_user, name='current_user'),
    path('register/', views.register, name='register'),
]
