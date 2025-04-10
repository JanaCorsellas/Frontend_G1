# Frontend Projecte EA

## Requisits previs
Abans d'executar el projecte, assegura't de tenir instal·lat:
- [Node.js](https://nodejs.org/)
- [Angular](https://www.angular.dev/)

A més a més, el servidor assumeix de que estàs fent servir el [backend](https://github.com/JanaCorsellas/Backend_G1/), amb el port assignat a **3000**.

## Organització carpetes del projecte
```
├── public
├── src: El codi font de la pàgina web
    └── app
        ├── backoffice: 
        ├── backoffice-activity: El panell d'administració de les activitats
        ├── backoffice-user: El panell d'administració dels usuaris creats
        ├── confirm-dialog: Advertència genèrica per avisar d'una acció important
        ├── login: El formulari per iniciar sessió
        ├── models: La descripció del elements que es toquen en la pàgina web
        ├── pipes
        ├── register: El formulari per crear-se un compte
        ├── services: La descripció de l'API que fa servir la pàgina web
        ├── app.component.css
        ├── app.component.html
        ├── app.component.spec.ts
        ├── app.component.ts
        ├── app.config.ts
        ├── app.module.ts
        ├── app.routes.ts
        └── app-routing.module.ts
```

## Instal·lació
Clona el repositori i executa la següent comanda per instal·lar les dependències:

```sh
npm install
```

## Execució
Per compilar i executar el servidor web:

```sh
npm run build
npm run start
```

Una vegada que la pàgina web està en marxa, es pot accedir a ella a través del següent enllaç:
```
http://localhost:4200/
```
