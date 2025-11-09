from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, serializers

from django.contrib.auth.models import User
from .models import Establishment, Review, Category, Product
from .api import send_purchased_items


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
    })


# --- Serializers used by the API endpoints ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class EstablishmentSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Establishment
        fields = ('id', 'name', 'category', 'address', 'city', 'latitude', 'longitude', 'description', 'avg_rating')


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


from django.contrib.contenttypes.models import ContentType

class ReviewSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    content_type = serializers.CharField(write_only=True)
    object_id = serializers.IntegerField(write_only=True)

    # For read-only, show reviewed object type and id
    reviewed_type = serializers.SerializerMethodField(read_only=True)
    reviewed_id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'content_type', 'object_id', 'reviewed_type', 'reviewed_id', 'rating', 'comment', 'created_at')

    def get_reviewed_type(self, obj):
        return obj.content_type.model if obj.content_type else None

    def get_reviewed_id(self, obj):
        return obj.object_id

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return value

    def validate(self, attrs):
        # Validate content_type and object_id
        model_label = attrs.get('content_type')
        object_id = attrs.get('object_id')
        try:
            content_type = ContentType.objects.get(model=model_label)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({'content_type': 'Invalid content type'})
        model_class = content_type.model_class()
        if not model_class.objects.filter(pk=object_id).exists():
            raise serializers.ValidationError({'object_id': 'Object does not exist'})
        attrs['content_type'] = content_type
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user is None or not user.is_authenticated:
            raise serializers.ValidationError('Authentication credentials were not provided')
        review = Review.objects.create(user=user, **validated_data)
        return review


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # Keep a small, explicit register implementation if needed later.
    return Response({'detail': 'Registration endpoint not implemented here.'}, status=status.HTTP_501_NOT_IMPLEMENTED)


# --- API endpoints ---
@api_view(['GET'])
@permission_classes([AllowAny])
def establishments_list(request):
    """Return all establishments."""
    qs = Establishment.objects.all().select_related('category')
    serializer = EstablishmentSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def reviews_list(request):
    """Return all reviews."""
    qs = Review.objects.select_related('user', 'establishment', 'establishment__category').all()
    serializer = ReviewSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request):
    """
    Create a new Review for the authenticated user.
    Expected payload: { "content_type": "establishment"|"product", "object_id": <int>, "rating": <1-5>, "comment": "..." }
    """
    serializer = ReviewSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_establishment(request):
    """Create a new Establishment for the authenticated user.

    Expected payload: { "name": "...", "category": <int>, "address": "...", "city": "...", "latitude": <float>, "longitude": <float>, "description": "..." }
    """
    if Establishment.objects.filter(name=request.data.get('name')).exists():
        return Response({'detail': 'Establishment with this name already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    establishment = Establishment(name =request.data.get('name'),
                                  category = Category.objects.get(id=request.data.get('category')),
                                  address = request.data.get('address'),
                                  city = request.data.get('city'),
                                  latitude = request.data.get('latitude'),
                                  longitude = request.data.get('longitude'),
                                  description = request.data.get('description'))
    establishment.save()
    return Response(EstablishmentSerializer(establishment).data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_products(request):
    """
    Add multiple products in one request.
    Expected payload:
    {
        "products": [
            {
                "establishment": <int>,  # establishment id
                "name": "...", "description": "...", "price": <float>
            },
            ...
        ]
    }
    """
    products_data = request.data.get('products', [])

    if not products_data:
        return Response({'detail': 'Products are required.'}, status=status.HTTP_400_BAD_REQUEST)

    created_products = []
    errors = []

    for prod in products_data:
        establishment_id = prod.get('establishment')
        name = prod.get('name')
        if not establishment_id or not name:
            errors.append({'product': prod, 'error': 'Establishment and name are required.'})
            continue
        try:
            establishment = Establishment.objects.get(pk=establishment_id)
        except Establishment.DoesNotExist:
            errors.append({'product': prod, 'error': 'Establishment not found.'})
            continue
        product = establishment.products.create(
                name=name,
            description=prod.get('description', ''),
            price=prod.get('price')
        )
        created_products.append(product)

    # Simple serializer for response
    class ProductSerializer(serializers.ModelSerializer):
        class Meta:
            model = created_products[0].__class__ if created_products else None
            fields = ('id', 'name', 'description', 'price', 'rating', 'created_at')
    response_data = {
        'created': ProductSerializer(created_products, many=True).data if created_products else [],
        'errors': errors
    }
    return Response(response_data, status=status.HTTP_201_CREATED if created_products else status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_products(request):
    """
    List all products for a given establishment_id
    Expected payload :
    {}
    """
    establishment_id = request.query_params.get('establishment_id')
    if not establishment_id:
        products_qs = Product.objects.all()
    else:
        try:
            establishment = Establishment.objects.get(pk=establishment_id)
        except Establishment.DoesNotExist:
            return Response({'detail': 'Establishment not found.'}, status=status.HTTP_404_NOT_FOUND)
        products_qs = establishment.products.all()

    class ProductReadSerializer(serializers.ModelSerializer):
        class Meta:
            model = Product
            fields = ('id', 'name', 'description', 'price', 'rating', 'created_at')

    return Response(ProductReadSerializer(products_qs, many=True).data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_products(request):
    """
    Simulate a purchase of products.
    Expected payload:
    {
        "establishment_id": <int>,
        "items": [
            { "id": <product_id>, "qty": <number> },
            ...
        ]
    }
    """
    establishment_id = request.data.get('establishment_id')
    items = request.data.get('items', [])

    if not establishment_id or not items:
        return Response({'detail': 'Establishment ID and items are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        establishment = Establishment.objects.get(pk=establishment_id)
    except Establishment.DoesNotExist:
        return Response({'detail': 'Establishment not found.'}, status=status.HTTP_404_NOT_FOUND)

    purchased_items = []
    errors = []

    for item in items:
        product_id = item.get('id')
        qty = item.get('qty', 1)
        if not product_id or qty <= 0:
            errors.append({'item': item, 'error': 'Product ID and positive quantity are required.'})
            continue
        try:
            product = establishment.products.get(pk=product_id)
        except Product.DoesNotExist:
            errors.append({'item': item, 'error': 'Product not found in this establishment.'})
            continue
        purchased_items.append({
            'product_id': product.id,
            'name': product.name,
            'description': product.description,
            'quantity': qty,
            'unit_price': float(product.price) if product.price else None,
            'total_price': float(product.price) * qty if product.price else None
        })

    email_sent = send_purchased_items(request, establishment, purchased_items)

    response_data = {
        'purchased_items': purchased_items,
        'errors': errors,
        'email_sent': email_sent
    }
    return Response(response_data, status=status.HTTP_200_OK if purchased_items else status.HTTP_400_BAD_REQUEST)