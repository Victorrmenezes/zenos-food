from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.current_user, name='current_user'),
    path('register/', views.register, name='register'),
    path('establishments/', views.establishments_list, name='establishments_list'),
    path('establishments/add/', views.add_establishment, name='add_establishment'),
    path('products/add/', views.add_products, name='add_products'),
    path('reviews/', views.reviews_list, name='reviews_list'),
    path('reviews/add/', views.add_review, name='add_review'),
]
