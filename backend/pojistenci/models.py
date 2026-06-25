from django.db import models
from django.contrib.auth.models import User

class Pojistenec(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='pojistenec')
    jmeno = models.CharField(max_length=50)
    prijmeni = models.CharField(max_length=50)
    email = models.EmailField()
    telefon = models.CharField(max_length=20)
    vek = models.IntegerField()

    class Meta:
        verbose_name = "Pojištěnec"
        verbose_name_plural = "Pojištěnci"

    def __str__(self):
        return f"{self.jmeno} {self.prijmeni}"

class Pojistka(models.Model):
    TYPY = [
        ('zdravotni', 'Zdravotní'),
        ('zivotni', 'Životní'),
        ('automobilove', 'Automobilové'),
        ('majetkove', 'Majetkové'),
        ('cestovni', 'Cestovní'),
        ('urazove', 'Úrazové'),
    ]

    pojistenec = models.ForeignKey(Pojistenec, on_delete=models.CASCADE, related_name='pojistky')
    typ = models.CharField(max_length=100, choices=TYPY)
    nazev = models.CharField(max_length=200)
    castka = models.DecimalField(max_digits=10, decimal_places=2)
    datum_zacatku = models.DateField()
    datum_konce = models.DateField()
    aktivni = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Pojistka"
        verbose_name_plural = "Pojišťky"

    def __str__(self):
        return f"{self.nazev} - {self.pojistenec}"