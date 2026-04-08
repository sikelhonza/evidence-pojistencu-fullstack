from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PojistenecViewSet

router = DefaultRouter()
router.register(r'pojistenci', PojistenecViewSet)

urlpatterns = [
    path('', include(router.urls)),


    
]