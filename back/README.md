# Yoga App


Une application Spring Boot pour la gestion d'un studio de yoga, développée avec Java 17 et Spring Boot 2.6.1.

## Prérequis

- **Java 17** ou supérieur
- **Maven 3.6+**
- **Docker** (pour Testcontainers - lancé automatiquement)
- **MySQL 8.0+** (uniquement pour le développement local)
- **IDE** compatible (IntelliJ IDEA, Eclipse, VS Code)

## Technologies utilisées

- **Framework**: Spring Boot 2.6.1
- **Sécurité**: Spring Security + JWT
- **Base de données**: MySQL + JPA/Hibernate
- **Tests**: JUnit 5, **Testcontainers** (MySQL automatique), Spring Boot Test
- **Documentation**: Swagger/OpenAPI 3
- **Mapping**: MapStruct
- **Couverture de code**: JaCoCo
- **Build**: Maven

## Guide pas-à-pas pour débutants complets

### Étape 1 : Prérequis (installation unique)
1. **Java 17** : Télécharger depuis [Oracle](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) ou [OpenJDK](https://openjdk.org/projects/jdk/17/)
2. **Maven** : Télécharger depuis [Maven Apache](https://maven.apache.org/download.cgi)
3. **Docker Desktop** : Télécharger depuis [Docker](https://www.docker.com/products/docker-desktop/)
4. **Git** : Télécharger depuis [Git](https://git-scm.com/downloads)

### Étape 2 : Récupérer le projet
```bash
# Cloner le projet
git clone https://github.com/Arnaud1720/P5-testez_une_application_full-stack.git
cd yoga-app
```

### Étape 3 : Lancer les tests avec rapports automatiques sur le bureau

**Windows (PowerShell) :**
```powershell
mvn clean verify; if ($?) { xcopy "target\site\jacoco-merged" "$env:USERPROFILE\Desktop\yoga-app-reports\" /E /I /Y }
```

**Linux/Mac :**
```bash
mvn clean verify && cp -r target/site/jacoco-merged ~/Desktop/yoga-app-reports/
```

**WSL :**
```bash
mvn clean verify && cp -r target/site/jacoco-merged /mnt/c/Users/$USER/Desktop/yoga-app-reports/
```

### Étape 4 : Consulter les rapports
- Ouvrir le dossier `yoga-app-reports` sur votre bureau
- Double-cliquer sur `index.html`
- Les rapports de couverture s'ouvrent dans votre navigateur

### Dépannage rapide
- **"mvn command not found"** : Maven n'est pas installé ou pas dans le PATH
- **"Docker daemon not running"** : Lancer Docker Desktop
- **"Permission denied"** : Lancer le terminal en administrateur (Windows) ou avec sudo (Linux/Mac)

## Installation et démarrage rapide pour développeurs

### 1. Cloner le projet
```bash
git clone https://github.com/Arnaud1720/P5-testez_une_application_full-stack.git
cd P5-testez_une_application_full-stack
```

### 2. Configuration de la base de données
**Aucune configuration manuelle requise !**
- Les tests utilisent **Testcontainers** qui lance automatiquement un conteneur MySQL
- Pour le développement, configurez vos paramètres dans `application.properties`
- Pour les tests, tout est géré automatiquement via `AbstractMySqlIT.java`

### 3. Installer les dépendances
```bash
mvn clean install
```

### 4. Lancer l'application
```bash
mvn spring-boot:run
```

L'application sera accessible sur : `http://localhost:8080`

## Commandes Maven essentielles

### Build et compilation
```bash
# Compilation propre
mvn clean compile

# Build complet avec tests
mvn clean install

# Build sans tests
mvn clean install -DskipTests

# Package (création du JAR)
mvn clean package
```

### Exécution
```bash
# Démarrage en mode développement
mvn spring-boot:run

# Démarrage avec profil spécifique
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Exécution du JAR généré
java -jar target/yoga-app-0.0.1-SNAPSHOT.jar
```

### Tests avec copie automatique des rapports
```bash
# Tests avec rapport de couverture
mvn clean verify

# Tests avec copie automatique des rapports sur le bureau
# Windows (PowerShell)
mvn clean verify && xcopy "target\site\jacoco-merged" "%USERPROFILE%\Desktop\yoga-app-reports\" /E /I /Y

# Windows (CMD)  
mvn clean verify && robocopy target\site\jacoco-merged %USERPROFILE%\Desktop\yoga-app-reports /E

# Linux/Mac
mvn clean verify && cp -r target/site/jacoco-merged ~/Desktop/yoga-app-reports/

# WSL (depuis le projet)
mvn clean verify && cp -r target/site/jacoco-merged /mnt/c/Users/$USER/Desktop/yoga-app-reports/

# Lancer uniquement les tests d'intégration spécifiques
mvn test -Dtest=SessionIT
mvn test -Dtest=UserIT
mvn test -Dtest=TeacherIT
```

> **Note**: Les tests d'intégration utilisent Testcontainers qui lance automatiquement un conteneur MySQL. Aucune configuration de base de données manuelle n'est requise !

### Rapports et qualité
```bash
# Génération des rapports JaCoCo
mvn jacoco:report

# Rapport de couverture globale (UT + IT)
mvn clean verify
# Les rapports sont dans target/site/jacoco-merged/
```

## Tests d'intégration avec Testcontainers

L'application utilise une architecture de tests moderne avec **Testcontainers** :

### Configuration automatique
- **`AbstractMySqlIT.java`** : Classe de base qui lance un conteneur MySQL automatiquement
- **Profil test** : `application-test.properties` avec `create-drop` pour des tests isolés
- **Pas de configuration manuelle** : MySQL est créé et détruit automatiquement

### Classes de tests disponibles
- **`SessionIT.java`** : Tests d'intégration pour les sessions yoga
- **`UserIT.java`** : Tests d'intégration pour l'authentification et users
- **`TeacherIT.java`** : Tests d'intégration pour la gestion des professeurs

### Lancement des tests
```bash
# Tous les tests d'intégration (Docker requis)
mvn verify

# Test spécifique d'intégration
mvn test -Dtest=SessionIT

# Tests avec nettoyage automatique de la base
mvn clean verify
```

## Couverture de code

Les rapports JaCoCo sont générés automatiquement lors du `mvn verify` :

- **Tests unitaires** : `target/site/jacoco-ut/index.html`
- **Tests d'intégration** : `target/site/jacoco-it/index.html`
- **Rapport global** : `target/site/jacoco-merged/index.html`

## Documentation API

La documentation Swagger est accessible une fois l'application démarrée :
- **Swagger UI** : `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON** : `http://localhost:8080/v3/api-docs`

## Structure du projet

```
yoga-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/openclassrooms/yogaapp/
│   │   │       ├── controller/     # Contrôleurs REST
│   │   │       ├── service/        # Services métier
│   │   │       ├── repository/     # Repositories JPA
│   │   │       ├── model/          # Entités JPA
│   │   │       ├── dto/            # Data Transfer Objects
│   │   │       ├── mapper/         # MapStruct mappers
│   │   │       ├── security/       # Configuration sécurité
│   │   │       └── config/         # Configurations
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql           # Données de test
│   └── test/
│       ├── java/                  # Tests unitaires (*Test.java)
│       └── integration-test/      # Tests d'intégration (*IT.java)
├── target/                        # Artefacts générés
├── pom.xml
└── README.md
```

## Profils d'environnement

L'application supporte différents profils :

```bash
# Développement
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Test
mvn spring-boot:run -Dspring-boot.run.profiles=test

# Production
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Debugging

### Mode debug avec Maven
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

### Logs en mode verbose
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--logging.level.com.openclassrooms=DEBUG"
```

## Déploiement

### Création du JAR exécutable
```bash
mvn clean package
java -jar target/yoga-app-0.0.1-SNAPSHOT.jar
```

### Avec profil de production
```bash
java -jar target/yoga-app-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request
