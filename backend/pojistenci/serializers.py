from rest_framework import serializers
from .models import Pojistenec, Pojistka
from django.contrib.auth.models import User

class PojistkaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pojistka
        fields = '__all__'

class PojistenecSerializer(serializers.ModelSerializer):
    pojistky = PojistkaSerializer(many=True, read_only=True) 
    class Meta:
        model = Pojistenec
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password', 'email']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Hesla se neshodují."})
        if len(data['password']) < 8:
            raise serializers.ValidationError({"password": "Heslo musí mít alespoň 8 znaků."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user