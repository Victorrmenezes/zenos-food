from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Product(models.Model):
    """
    Represents a product that can be reviewed and associated with establishments.
    """
    name = models.CharField(max_length=150, db_index=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    establishment = models.ForeignKey('Establishment', on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-rating", "name"]

    def __str__(self):
        return f"{self.name}"

    def update_rating(self):
        average = self.reviews.aggregate(avg=Avg("rating"))["avg"] or 0.0
        self.rating = round(average, 2)
        self.save(update_fields=["rating"])


class Category(models.Model):
    """
    Representa a categoria principal de um estabelecimento (ex: Restaurante, Hotel, Loja).
    Pode futuramente evoluir para um modelo hierárquico com subcategorias.
    """
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Establishment(models.Model):
    """
    Modelo principal de Estabelecimento.
    Contém dados básicos e geográficos, e uma média de avaliações recalculada automaticamente.
    """
    name = models.CharField(max_length=150, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="establishments")

    # Campos opcionais de localização e descrição
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    # Imagem e metadados
    # image = models.ImageField(upload_to="establishments/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    class Meta:
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["city"]),
            models.Index(fields=["avg_rating"]),
        ]
        ordering = ["-avg_rating", "name"]

    def __str__(self):
        return f"{self.name} ({self.category.name})"

    def update_avg_rating(self):
        """
        Atualiza a média de avaliações do estabelecimento, chamada automaticamente via signal.
        """
        average = self.reviews.aggregate(avg=Avg("rating"))["avg"] or 0.0
        self.avg_rating = round(average, 2)
        self.save(update_fields=["avg_rating"])


class Review(models.Model):
    """
    Generic review model supporting reviews for establishments, products, or any object.
    """
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Generic relation fields
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["rating"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return f"Review by {self.user.username} on {self.content_object}" 

    def short_comment(self):
        return (self.comment[:50] + "...") if self.comment and len(self.comment) > 50 else self.comment


# --- SIGNALS ---

@receiver([post_save, post_delete], sender=Review)
def update_reviewed_object_rating(sender, instance, **kwargs):
    """
    Atualiza a média do objeto avaliado (estabelecimento, produto, etc) sempre que uma Review for criada, alterada ou removida.
    """
    content_object = instance.content_object
    if hasattr(content_object, 'update_avg_rating'):
        content_object.update_avg_rating()
    elif hasattr(content_object, 'update_rating'):
        content_object.update_rating()
