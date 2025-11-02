from django.contrib import admin
from .models import Category, Establishment, Product, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
@admin.register(Establishment)
class EstablishmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'city', 'avg_rating', 'created_at')
    list_filter = ('category', 'city')
    search_fields = ('name', 'address', 'city')
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'comment')
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price', 'establishment', 'created_at')
    list_filter = ('establishment', 'created_at')
    search_fields = ('name', 'description')