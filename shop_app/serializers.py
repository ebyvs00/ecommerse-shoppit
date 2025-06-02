from rest_framework import serializers
from .models import Product, Cart, CartItem
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

class ProductSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "image", "description", "category", "price"]  

    def get_price(self, obj):
        return float(obj.price)  # Return as float, frontend handles formatting

class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField(read_only=True)
    price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "price", "slug", "image", "description", "similar_products"]

    def get_price(self, obj):
        return float(obj.price)

    def get_similar_products(self, product):
        products = Product.objects.filter(category=product.category).exclude(id=product.id)
        return ProductSerializer(products, many=True).data

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "quantity", "product", "total"]

    def get_total(self, cartitem):
        return float(cartitem.product.price * cartitem.quantity)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    sum_total = serializers.SerializerMethodField(read_only=True)
    num_of_items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "items", "sum_total", "num_of_items", "created_at", "modified_at"]

    def get_sum_total(self, cart):
        return sum(item.product.price * item.quantity for item in cart.items.all()) if cart.items.exists() else 0

    def get_num_of_items(self, cart):
        return sum(item.quantity for item in cart.items.all()) if cart.items.exists() else 0

class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "cart_code", "num_of_items"]

    def get_num_of_items(self, cart):
        return sum(item.quantity for item in cart.items.all()) if cart.items.exists() else 0


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(username=data["username"]).first()
        if user and user.check_password(data["password"]):
            refresh = RefreshToken.for_user(user)
            return {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        raise serializers.ValidationError("Invalid username or password")