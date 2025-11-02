from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, serializers

from django.contrib.auth.models import User
from .models import Establishment, Review, Category


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


class ReviewSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    establishment = EstablishmentSerializer(read_only=True)
    establishment_id = serializers.PrimaryKeyRelatedField(queryset=Establishment.objects.all(), source='establishment', write_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'establishment', 'establishment_id', 'rating', 'comment', 'created_at')

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user is None or not user.is_authenticated:
            raise serializers.ValidationError('Authentication credentials were not provided')

        establishment = validated_data.pop('establishment')
        review = Review.objects.create(user=user, establishment=establishment, **validated_data)
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
    """Create a new Review for the authenticated user.

    Expected payload: { "establishment_id": <int>, "rating": <1-5>, "comment": "..." }
    """
    serializer = ReviewSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)