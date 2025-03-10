# Backend Node Template

## ✅ Primero lo primero: instalar las dependencias iniciales del proyecto antes de trabajar:

```
npm install
```

## 🚩 Recomendaciones:

Utilizar la versión de Node v14.x

## 💡 El proyecto utliza Sequelize como ORM. Comandos utiles del CLI:

### Como generar un modelo desde cero

```
npx sequelize model:generate --name Ejemplo --attributes ejemplo:string
```

### Crear la base de datos

```
npx sequelize db:create
```

### Migrar modelos creados previamente

```
npx sequelize db:migrate
```

### Ejecutar seeders para poblar la base de datos

```
npx sequelize-cli db:seed:all
```
### Si quieres acceder como administrador despues de ejecutar los seeders las credeenciales del administrador son:

email: admin@gmail.com
password: 12345678

### Borrar la base de datos que creamos

```
npx sequelize db:drop
```

## 🏗 Algunos datos del proyecto:

- La estructura de carpetas es del patron MVC
- Las respuestas positivas las devuelve como un objecto. Las negativas las gestiona como un HTML
- En el proyecto encontrarán un ejemplo de como se implementa el flujo de información dentro de la app.
- Para el flujo de trabajo utilizaremos Gitflow. Para el mismo deberan crear una rama con el numero de tarjeta con el que esten trabajando

![image](https://user-images.githubusercontent.com/79473217/193649836-2720c8f4-a038-4014-b9a5-c515a9aee273.png)

- Cuando el trabajo este terminado, se debe generar el "Pull Request" o PR como le solemos llamar. El proyecto ya cuenta con un template de PR, por lo que ustedes solo tendran que completar con los datos que les indica el template. Esta seria una imagen de ejemplo de un PR con su evidencia en caso de falla y su caso de éxito.

![image](https://user-images.githubusercontent.com/79473217/193650283-f9d52ece-3548-4a27-8cbf-63fc9fcf72e2.png)

- Las respuestas positivas se gestionan con el helper enpodintResponse, y los negativos con createHtppError de la libreria http-errors.
  Ejemplo de satisfactoria

Ejemplo de respuesta negativa:
![image](https://user-images.githubusercontent.com/79473217/193651690-f0081ce6-9d2e-43ca-9986-bec8a9082d7f.png)

