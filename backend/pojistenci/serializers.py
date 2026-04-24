from rest_framework import serializers
from .models import Pojistenec
from django.contrib.auth.models import User

class PojistenecSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pojistenec
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    # Pole pro potvrzení hesla (není v modelu User, pouze pro validaci)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password', 'email']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}  # Povinný email
        }

    def validate(self, data):
        # 1. Kontrola shody hesel
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Hesla se neshodují."})
        
        # 2. Kontrola délky hesla
        if len(data['password']) < 8:
            raise serializers.ValidationError({"password": "Heslo musí mít alespoň 8 znaků."})
            
        return data

    def create(self, validated_data):
        # Odstraníme confirm_password, aby ho User.objects.create_user nezkoušel uložit
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user