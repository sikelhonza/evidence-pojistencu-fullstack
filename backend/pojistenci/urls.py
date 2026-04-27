from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PojistenecViewSet, PojistkaViewSet, register, me

router = DefaultRouter()
router.register(r'pojistenci', PojistenecViewSet)
router.register(r'pojistky', PojistkaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register),
    path('me/', me),
]