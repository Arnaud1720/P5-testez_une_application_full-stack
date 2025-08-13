# Yoga

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project
Méthode 1 : Télécharger le ZIP depuis GitHub (recommandé pour les débutants)
Allez sur la page du projet :
> 👉 https://github.com/Arnaud1720/P5-testez_une_application_full-stack

Cliquez sur le bouton vert "Code"
Sélectionnez "Download ZIP"
Extrayez le dossier sur votre ordinateur (ex: sur le bureau)
Ouvrez le dossier avec un éditeur comme VS Code, IntelliJ IDEA, ou même le Bloc-notes


Git clone:

> git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing

Go inside folder:

> cd yoga

Install dependencies:

> npm install

Launch Front-end:

> npm run start;


## Ressources

### Mockoon env 

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json 

by following the documentation: 

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman


### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234


### Test

#### E2E

Launching e2e test:

> npm run e2e

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

#### Unitary test

Launching test:

> npm run test

for following change:

> npm run test:watch
