from rest_framework import serializers
from .models import Pojistenec

class PojistenecSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pojistenec
        fields = '__all__'