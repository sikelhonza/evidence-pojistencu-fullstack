from rest_framework import serializers
from .models import Pojistenec, Pojistka
import re


class PojistkaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pojistka
        fields = ['id', 'pojistenec', 'typ', 'nazev', 'castka', 'datum_zacatku', 'datum_konce', 'aktivni']
        read_only_fields = ['id']

    def validate(self, data):
        if data.get('datum_konce') and data.get('datum_zacatku'):
            if data['datum_konce'] <= data['datum_zacatku']:
                raise serializers.ValidationError("Datum konce nemůže být před datumem začátku.")

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

    def validate_email(self, value):
        queryset = Pojistenec.objects.filter(email=value) 
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Tento email již existuje.")
        return value
    
    def validate_telefon(self, value):
        if not re.match (r'^\+?\d{9,15}$', value):
            raise serializers.ValidationError("Telefonní číslo musí být ve formátu +420123456789 nebo 123456789.")
        return value    


    def validate_vek(self, value):
        if value < 1 or value > 120:
            raise serializers.ValidationError("Věk musí být mezi 1 a 120.")
        return value

    def validate_jmeno(self, value):
        if not value.strip():
            raise serializers.ValidationError("Jméno nesmí být prázdné.")
        if len(value) < 2:
            raise serializers.ValidationError("Jméno musí mít alespoň 2 znaky.")
        return value.strip()

    def validate_prijmeni(self, value):
        if not value.strip():
            raise serializers.ValidationError("Příjmení nesmí být prázdné.")
        if len(value) < 2:
            raise serializers.ValidationError("Příjmení musí mít alespoň 2 znaky.")
        return value.strip()

    class Meta:
        model = Pojistenec
        fields = ['id', 'jmeno', 'prijmeni', 'email', 'telefon', 'vek', 'pojistky']

