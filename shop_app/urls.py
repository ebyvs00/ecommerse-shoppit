from django.urls import path
from .views import (
    register_user, login_user, logout_user, products, product_detail, 
    add_item, product_in_cart, get_cart_stat, get_cart, update_quantity, delete_cartitem
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import create_order, payment_success


urlpatterns = [
    # ✅ Authentication Endpoints
    path("api/auth/signup/", register_user, name="signup"),  
    path("api/auth/login/", login_user, name="login"),
    path("api/auth/logout/", logout_user, name="logout"),

    # ✅ JWT Token Endpoints
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ✅ Product Endpoints
    path("api/products/", products, name="products"),
    path("api/products/<slug:slug>/", product_detail, name="product_detail"),

    # ✅ Cart Endpoints
    path("api/cart/add/", add_item, name="add_item"),  
    path("api/cart/check/", product_in_cart, name="product_in_cart"),
    path("api/cart/statistics/", get_cart_stat, name="get_cart_stat"),
    path("api/cart/", get_cart, name="get_cart"),  # ✅ Changed to match React request
    path("api/cart/update/", update_quantity, name="update_quantity"),
    path("api/cart/delete/", delete_cartitem, name="delete_cartitem"),

    path('api/payment/create-order/', create_order, name='create_order'),
    path('api/payment/success/', payment_success, name='payment_success'),

    
]
