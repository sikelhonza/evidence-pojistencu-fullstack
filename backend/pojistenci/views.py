from django.utils import timezone
from datetime import timedelta
from .models import Pojistenec, Pojistka
from .serializers import PojistenecSerializer, PojistkaSerializer
from .authentication import LoginRateThrottle
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings as django_settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

class PojistenecViewSet(viewsets.ModelViewSet):
    serializer_class = PojistenecSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pojistenec.objects.all()
        return Pojistenec.objects.filter(user=self.request.user)


class PojistkaViewSet(viewsets.ModelViewSet):
    serializer_class = PojistkaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pojistka.objects.all()
        try:
            return Pojistka.objects.filter(pojistenec=self.request.user.pojistenec)
        except Pojistenec.DoesNotExist:
            return Pojistka.objects.none()

def _cookie_settings(django_settings):
    return {
        'httponly': True,
        'secure': not django_settings.DEBUG,
        'samesite': 'Lax',
    }


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def token_obtain(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')

    if not username or not password:
        return Response({'detail': 'Zadejte uživatelské jméno a heslo.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'detail': 'Nesprávné přihlašovací údaje.'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    opts = _cookie_settings(django_settings)

    response = Response({'detail': 'Přihlášení úspěšné.'})
    response.set_cookie('access_token', str(refresh.access_token), max_age=3600, **opts)
    response.set_cookie('refresh_token', str(refresh), max_age=7 * 24 * 3600, **opts)
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def token_refresh_cookie(request):
    raw_refresh = request.COOKIES.get('refresh_token')
    if not raw_refresh:
        return Response({'detail': 'Nejste přihlášeni.'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        refresh = RefreshToken(raw_refresh)
        user = User.objects.get(id=refresh.payload['user_id'])
        refresh.blacklist()
        new_refresh = RefreshToken.for_user(user)
        opts = _cookie_settings(django_settings)
        response = Response({'detail': 'Token obnoven.'})
        response.set_cookie('access_token', str(new_refresh.access_token), max_age=3600, **opts)
        response.set_cookie('refresh_token', str(new_refresh), max_age=7 * 24 * 3600, **opts)
        return response
    except (TokenError, User.DoesNotExist):
        return Response({'detail': 'Přihlášení vypršelo.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def token_logout(request):
    try:
        raw_refresh = request.COOKIES.get('refresh_token')
        if raw_refresh:
            RefreshToken(raw_refresh).blacklist()
    except TokenError:
        pass

    opts = _cookie_settings(django_settings)
    response = Response({'detail': 'Odhlášení úspěšné.'})
    response.delete_cookie('access_token', samesite=opts['samesite'])
    response.delete_cookie('refresh_token', samesite=opts['samesite'])
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    import re

    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')
    confirm_password = request.data.get('confirm_password', '')
    jmeno = request.data.get('jmeno', '').strip()
    prijmeni = request.data.get('prijmeni', '').strip()
    telefon = request.data.get('telefon', '').strip()
    vek = request.data.get('vek')

    errors = {}

    if not username or len(username) < 3:
        errors['username'] = 'Uživatelské jméno musí mít alespoň 3 znaky.'
    elif User.objects.filter(username=username).exists():
        errors['username'] = 'Uživatel s tímto jménem již existuje.'

    if not email or not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        errors['email'] = 'Zadejte platnou e-mailovou adresu.'
    elif User.objects.filter(email=email).exists():
        errors['email'] = 'Účet s tímto e-mailem již existuje.'

    if not password or len(password) < 8:
        errors['password'] = 'Heslo musí mít alespoň 8 znaků.'
    elif password != confirm_password:
        errors['password'] = 'Hesla se neshodují.'
    else:
        try:
            validate_password(password, user=User(username=username, email=email))
        except DjangoValidationError as e:
            chybove_hlasky = {
                'This password is too short. It must contain at least 8 characters.': 'Heslo je příliš krátké. Musí obsahovat alespoň 8 znaků.',
                'This password is too common.': 'Heslo je příliš běžné.',
                'This password is entirely numeric.': 'Heslo nesmí být pouze čísla.',
                }
            original = e.messages[0]
            errors['password'] = chybove_hlasky.get(original, original)

    if not jmeno or len(jmeno) > 50:
        errors['jmeno'] = 'Jméno je povinné (max 50 znaků).'

    if not prijmeni or len(prijmeni) > 50:
        errors['prijmeni'] = 'Příjmení je povinné (max 50 znaků).'

    if not telefon or not re.match(r'^\+?[\d\s\-]{9,20}$', telefon):
        errors['telefon'] = 'Zadejte platné telefonní číslo (9–20 číslic).'

    try:
        vek = int(vek)
        if vek < 1 or vek > 120:
            errors['vek'] = 'Věk musí být mezi 1 a 120.'
    except (TypeError, ValueError):
        errors['vek'] = 'Věk musí být celé číslo.'

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)

    Pojistenec.objects.create(
        user=user,
        jmeno=jmeno,
        prijmeni=prijmeni,
        email=email,
        telefon=telefon,
        vek=vek,
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
    except Pojistenec.DoesNotExist:
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