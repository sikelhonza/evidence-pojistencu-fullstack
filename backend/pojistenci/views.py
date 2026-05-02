from django.shortcuts import render
from django.utils import timezone
from datetime import timedelta
from .models import Pojistenec, Pojistka
from .serializers import PojistenecSerializer, PojistkaSerializer
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

class PojistkaViewSet(viewsets.ModelViewSet):
    queryset = Pojistka.objects.all()
    serializer_class = PojistkaSerializer
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

    user = User.objects.create_user(username=username, email=email, password=password)

    Pojistenec.objects.create(
        user=user,
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
    try:
        pojistenec = request.user.pojistenec
        pojistky = pojistenec.pojistky.all()
        pojistky_data = PojistkaSerializer(pojistky, many=True).data
        return Response({
            'is_staff': request.user.is_staff,
            'jmeno': pojistenec.jmeno,
            'prijmeni': pojistenec.prijmeni,
            'email': pojistenec.email,
            'telefon': pojistenec.telefon,
            'vek': pojistenec.vek,
            'pojistenec_id': pojistenec.id,
            'pojistky': pojistky_data,
        })
    except:
        return Response({
            'is_staff': request.user.is_staff,
            'jmeno': request.user.username,
            'prijmeni': '',
            'email': '',
            'telefon': '',
            'vek': None,
            'pojistenec_id': None,
            'pojistky': [],
        })
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if not request.user.is_staff:
        return Response({'detail': 'Nemáte oprávnění.'}, status=status.HTTP_403_FORBIDDEN)

    dnes = timezone.now().date()
    za_30_dni = dnes + timedelta(days=30)
    za_7_dni = dnes - timedelta(days=7)

    # Počty
    celkem_pojistencu = Pojistenec.objects.count()
    celkem_pojistek = Pojistka.objects.count()
    aktivni_pojistky = Pojistka.objects.filter(aktivni=True).count()
    brzy_vyprsi = Pojistka.objects.filter(datum_konce__lte=za_30_dni, datum_konce__gte=dnes, aktivni=True).count()

    # Pojistky podle typu
    typy = {}
    for pojistka in Pojistka.objects.filter(aktivni=True):
        typy[pojistka.typ] = typy.get(pojistka.typ, 0) + 1

    # Poslední registrace
    posledni_registrace = Pojistenec.objects.order_by('-id')[:5]
    posledni_data = [{'jmeno': p.jmeno, 'prijmeni': p.prijmeni, 'email': p.email} for p in posledni_registrace]

    # Nedávno přidané pojistky
    posledni_pojistky = Pojistka.objects.order_by('-id')[:5]
    posledni_pojistky_data = [{
        'nazev': p.nazev,
        'typ': p.typ,
        'pojistenec': f"{p.pojistenec.jmeno} {p.pojistenec.prijmeni}",
        'datum_konce': str(p.datum_konce),
    } for p in posledni_pojistky]

    return Response({
        'celkem_pojistencu': celkem_pojistencu,
        'celkem_pojistek': celkem_pojistek,
        'aktivni_pojistky': aktivni_pojistky,
        'brzy_vyprsi': brzy_vyprsi,
        'typy': typy,
        'posledni_registrace': posledni_data,
        'posledni_pojistky': posledni_pojistky_data,
    })