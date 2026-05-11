from rest_framework import serializers
from .models import Pojistenec, Pojistka


class PojistkaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pojistka
        fields = ['id', 'pojistenec', 'typ', 'nazev', 'castka', 'datum_zacatku', 'datum_konce', 'aktivni']
        read_only_fields = ['id']

    def validate(self, data):
        user = self.context['request'].user
        if not user.is_staff:
            data.pop('aktivni', None)
            data.pop('castka', None)
        return data
    
    def validate_pojistenec(self, value):
        user = self.context['request'].user
        if not user.is_staff and value.user != user:
            raise serializers.ValidationError("Nemáte oprávnění přidávat pojistky jiným pojištěncům.")
        return value



class PojistenecSerializer(serializers.ModelSerializer):
    pojistky = PojistkaSerializer(many=True, read_only=True)

    class Meta:
        model = Pojistenec
        fields = ['id', 'jmeno', 'prijmeni', 'email', 'telefon', 'vek', 'pojistky']
