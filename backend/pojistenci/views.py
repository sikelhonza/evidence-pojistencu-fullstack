from django.shortcuts import render
from .models import Pojistenec
from .serializers import PojistenecSerializer
from rest_framework import viewsets

class PojistenecViewSet(viewsets.ModelViewSet):
    queryset = Pojistenec.objects.all()
    serializer_class = PojistenecSerializer

# Create your views here.
