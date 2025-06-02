from django.urls import path
from .views import register_user, login_user, logout_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", register_user, name="register"),
    path("login/", login_user, name="login"),
    path("logout/", logout_user, name="logout"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # ✅ Add this line
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
