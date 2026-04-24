from django.shortcuts import render
from .models import Pojistenec
from .serializers import PojistenecSerializer
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User

class PojistenecViewSet(viewsets.ModelViewSet):
    queryset = Pojistenec.objects.all()
    serializer_class = PojistenecSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')
    jmeno = request.data.get('jmeno')
    prijmeni = request.data.get('prijmeni')
    telefon = request.data.get('telefon')
    vek = request.data.get('vek')

    if password != confirm_password:
        return Response({'password': 'Hesla se neshodují.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 8:
        return Response({'password': 'Heslo musí mít alespoň 8 znaků.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'password': 'Uživatel s tímto jménem již existuje.'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, email=email, password=password)

    Pojistenec.objects.create(
        jmeno=jmeno,
        prijmeni=prijmeni,
        email=email,
        telefon=telefon,
        vek=vek
    )

    return Response({'detail': 'Registrace proběhla úspěšně.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({'is_staff': request.user.is_staff})