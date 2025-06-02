from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Cart, CartItem  
from .serializers import (
    ProductSerializer, DetailedProductSerializer, 
    CartItemSerializer, SimpleCartSerializer, CartSerializer
)
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import razorpay
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# ✅ Get all products
@api_view(["GET"])
def products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# ✅ Get product details by slug
@api_view(["GET"])
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)


# ✅ Add item to cart
@api_view(["POST"])
def add_item(request):
    cart_code = request.data.get("cart_code")
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    if not cart_code or not product_id:
        return Response({"error": "cart_code and product_id are required"}, status=status.HTTP_400_BAD_REQUEST)

    product = get_object_or_404(Product, id=product_id)
    cart, _ = Cart.objects.get_or_create(cart_code=cart_code, paid=False)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    cart_item.quantity = int(quantity) if created else cart_item.quantity + int(quantity)
    cart_item.save()

    serializer = CartItemSerializer(cart_item)
    return Response({"success": True, "message": "Item added successfully!", "data": serializer.data}, status=status.HTTP_201_CREATED)


# ✅ Check if product is in cart
@api_view(["GET"])
def product_in_cart(request):
    cart_code = request.query_params.get("cart_code")
    product_id = request.query_params.get("product_id")

    if not cart_code or not product_id:
        return Response({"error": "cart_code and product_id are required"}, status=status.HTTP_400_BAD_REQUEST)

    cart = get_object_or_404(Cart, cart_code=cart_code, paid=False)
    product = get_object_or_404(Product, id=product_id)

    exists = CartItem.objects.filter(cart=cart, product=product).exists()
    return Response({"success": True, "product_in_cart": exists})


# ✅ Get cart statistics
@api_view(["GET"])
def get_cart_stat(request):
    cart_code = request.query_params.get("cart_code")

    if not cart_code:
        return Response({"error": "cart_code is required"}, status=status.HTTP_400_BAD_REQUEST)

    cart = get_object_or_404(Cart, cart_code=cart_code, paid=False)
    serializer = SimpleCartSerializer(cart)
    return Response(serializer.data)


# ✅ Get cart details (Now auto-creates cart if not found)
@api_view(["GET"])
def get_cart(request):
    cart_code = request.query_params.get("cart_code")

    if not cart_code:
        return Response({"error": "cart_code is required"}, status=status.HTTP_400_BAD_REQUEST)

    cart, created = Cart.objects.get_or_create(cart_code=cart_code, paid=False)  # ✅ Fix: Create if not found

    serializer = CartSerializer(cart)
    return Response(serializer.data)


# ✅ Update cart item quantity (Now deletes item if quantity = 0)
@api_view(["PATCH"])
def update_quantity(request):
    cartitem_id = request.data.get("item_id")
    quantity = request.data.get("quantity")

    if not cartitem_id or not quantity:
        return Response({"error": "item_id and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)

    cartitem = get_object_or_404(CartItem, id=cartitem_id)

    if int(quantity) <= 0:
        cartitem.delete()  # ✅ Fix: Deletes item if quantity is zero
        return Response({"success": True, "message": "Cart item removed"}, status=status.HTTP_204_NO_CONTENT)

    cartitem.quantity = int(quantity)
    cartitem.save()

    serializer = CartItemSerializer(cartitem)
    return Response({"success": True, "data": serializer.data, "message": "Cart item updated successfully!"})


# ✅ Delete cart item (Now uses `request.data` instead of `json.loads(request.body)`)
@api_view(["DELETE"])
def delete_cartitem(request):
    cartitem_id = request.data.get("item_id")

    if not cartitem_id:
        return Response({"error": "item_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    cartitem = get_object_or_404(CartItem, id=cartitem_id)
    cartitem.delete()

    return Response({"success": True, "message": "Cart item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# ✅ User Authentication
User = get_user_model()

@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True, "message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login_user(request):
    if "username" not in request.data or "password" not in request.data:
        return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()  # ✅ Fix: Blacklists refresh token
            return Response({"success": True, "message": "Logged out successfully!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Initialize Razorpay client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@csrf_exempt
def create_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            amount = int(float(data['amount']) * 100)  # Convert to paise
            
            order_data = {
                'amount': amount,
                'currency': 'INR',
                'payment_capture': 1
            }
            
            order = client.order.create(data=order_data)

            # Add key ID (token) to the response
            response = {
                'order': order,
                'key': settings.RAZORPAY_KEY_ID
            }

            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def payment_success(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            params_dict = {
                'razorpay_order_id': data['razorpay_order_id'],
                'razorpay_payment_id': data['razorpay_payment_id'],
                'razorpay_signature': data['razorpay_signature']
            }
            
            client.utility.verify_payment_signature(params_dict)
            
            # Payment successful - save to database
            # You can access the amount via data['amount']
            
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)