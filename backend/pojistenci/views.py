from django.shortcuts import render
from .models import Pojistenec
from .serializers import PojistenecSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated # Přidáno pro zabezpečení přístupu k API

class PojistenecViewSet(viewsets.ModelViewSet):
    queryset = Pojistenec.objects.all()
    serializer_class = PojistenecSerializer
    permission_classes = [IsAuthenticated] # Přidáno pro zabezpečení přístupu k API
# Create your views here.
