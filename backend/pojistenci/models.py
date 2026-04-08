from django.db import models

class Pojistenec(models.Model):
    jmeno = models.CharField(max_length=50)
    prijmeni = models.CharField(max_length=50)
    email = models.EmailField()
    telefon = models.CharField(max_length=20)
    vek = models.IntegerField()

    # Tato metoda zajistí, že v administraci uvidíš jméno, ne "Pojistenec object (1)"
    def __str__(self):
        return f"{self.jmeno} {self.prijmeni}"