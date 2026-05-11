from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PojistenecViewSet, PojistkaViewSet,
    register, me, admin_stats,
    token_obtain, token_refresh_cookie, token_logout,
)

router = DefaultRouter()
router.register(r'pojistenci', PojistenecViewSet, basename='pojistenec')
router.register(r'pojistky', PojistkaViewSet, basename='pojistka')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register),
    path('me/', me),
    path('admin-stats/', admin_stats),
    path('auth/login/', token_obtain),
    path('auth/refresh/', token_refresh_cookie),
    path('auth/logout/', token_logout),
]