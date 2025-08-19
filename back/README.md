# Yoga App — Backend

> API Spring Boot pour un studio de yoga — **Java17**. Tests unitaires et d’intégration **en une commande**.

---

##  Prérequis (à faire une fois)

- Java17 (JDK)
- Maven3.6+
- Docker démarré (nécessaire pour les tests d’intégration avec **Testcontainers**)
- Accès Internet au premier build (téléchargement des dépendances)

>  **Aucune installation MySQL** requise pour les tests: un conteneur **MySQL** est lancé automatiquement pendant les tests d’intégration.
 
---

##  Démarrage express (développeurs & non‑développeurs)
```bash
pour les non dev:
aller sur le projet gitHub : https://github.com/Arnaud1720/P5-testez_une_application_full-stack.git
cliquer sur le bouton vert "code" puis sur download Zip
```

```bash
# 1) Cloner puis entrer dans le projet
git clone https://github.com/Arnaud1720/P5-testez_une_application_full-stack.git
cd P5-testez_une_application_full-stack

# 2) Compiler + lancer tous les tests (UT + IT) + générer le rapport de couverture
mvn clean verify
```

Ouvrez ensuite le rapport global de couverture (double‑cliquez sur `index.html`):

```
target/site/jacoco-merged/index.html
```

---

##  rapport de coverage backend 

---
- IT   
```P5-testez_une_application_full-stack\back\target\site\jacoco-it\index.html```
- UT
  ```P5-testez_une_application_full-stack\back\target\site\jacoco-ut\index.html```
- Merge
  ```P5-testez_une_application_full-stack\back\target\site\jacoco-merged\index.html```


---
r