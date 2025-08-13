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

##  Lancer les tests

### Tout d’un coup (unitaires **+** intégration)
```bash
mvn clean verify
```

### Uniquement les **tests unitaires**
```bash
# Phase "test" uniquement (Surefire) → ne lance pas les IT
mvn test
```

### Uniquement les **tests d’intégration**
```bash
# On évite d’exécuter les UT et on cible les IT via Failsafe
mvn -Dtest=none -Dit.test=*IT -DfailIfNoTests=false verify
```

### Un **test unitaire** précis
```bash
# Exécute seulement UserServiceTest (adapter le nom)
mvn -Dtest=UserServiceTest test
```

### Un **test d’intégration** précis
```bash
# Exécute seulement SessionIT (adapter le nom)
mvn -Dit.test=SessionIT -DfailIfNoTests=false verify
```

**Conventions de nommage configurées dans Maven**
- **Unitaires (UT)**: fichiers se terminant par `*Test.java` (plugin **Surefire**)
- **Intégration (IT)**: fichiers se terminant par `*IT.java` ou `*ITCase.java` (plugin **Failsafe**)

---

##  Rapports JaCoCo (couverture)

Générés automatiquement pendant `verify`:

- UT: `target/site/jacoco-ut/index.html`
- IT: `target/site/jacoco-it/index.html`
- **Global (fusionné)**: `target/site/jacoco-merged/index.html`

### (optionnel) Copier le rapport sur le Bureau
- **Windows (PowerShell)**
  ```powershell
  mvn clean verify; if ($?) { xcopy "target\site\jacoco-merged" "$env:USERPROFILE\Desktop\yoga-app-reports\" /E /I /Y }
  ```
- **Linux / macOS**
  ```bash
  mvn clean verify && cp -r target/site/jacoco-merged ~/Desktop/yoga-app-reports/
  ```
- **WSL**
  ```bash
  mvn clean verify && cp -r target/site/jacoco-merged /mnt/c/Users/$USER/Desktop/yoga-app-reports/
  ```

---

## Lancer l’application (facultatif)

```bash
# Démarrer en développement
mvn spring-boot:run

# Package + exécution du JAR
mvn clean package
java -jar target/yoga-app-0.0.1-SNAPSHOT.jar
```

**Documentation API (springdoc‑openapi)** une fois l’app démarrée:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

---
