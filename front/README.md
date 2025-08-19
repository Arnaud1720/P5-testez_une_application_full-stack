### Frontend (Angular)
- **Unit tests (Karma/Jasmine) — couverture**:
  - Rapport: `front/coverage/<nom-projet>/index.html` *(après `ng test --code-coverage`)*
- **E2E (Cypress + nyc)** — si configuré:
  - Rapport: `front/coverage/lcov-report/index.html` *(après les scripts e2e + génération nyc)*

> ℹ️ Si un dossier n’existe pas après une commande, la phase correspondante n’a pas tourné (ex. pas de `failsafe-reports` ⇒ pas d’IT).

---

## 🛠️ Installer/Utiliser Angular CLI & Cypress (frontend)

### Angular CLI (compatible Angular 14.x)
```bash
# Installation globale de l’outil de ligne de commande
npm i -g @angular/cli@14

# Vérifier la version
ng version

# Installer les dépendances du front
cd front
npm install

# Démarrer le front
ng serve           # ou: npm run start
```

### Cypress (tests end‑to‑end)
```bash
# Depuis le dossier front
cd front

# Installer Cypress (dev dependency)
npm i -D cypress

# Ouvrir l’interface Cypress (mode interactif)
npx cypress open

# Lancer en mode headless (CI)
npx cypress run
```

### Couverture des tests unitaires Angular (optionnel)
```bash
cd front
npx ng test --watch=false --code-coverage
# Ouvrir ensuite: front/coverage/<nom-projet>/index.html
```

---

## ️ Lancer l’application backend (facultatif)

```bash
cd back

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

##  Dépannage rapide

- **`mvn: command not found`** → installez Maven et ajoutez‑le au `PATH`.
- **Docker non démarré / Testcontainers en erreur** → lancez Docker Desktop/Engine puis relancez `mvn clean verify`.
- **Port 8080 occupé** → `mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"`
- **Rapport JaCoCo vide** → vérifier que vos classes de tests respectent `*Test.java` (UT) et `*IT.java`/`*ITCase.java` (IT).

---


