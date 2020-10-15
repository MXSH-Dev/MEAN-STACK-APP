# MEAN-STACK-APP

## FrontEnd:

- Install:
  ```
  cd FrontEnd
  npm install
  ```
- Run:
  ```
  ng serve
  ```

## BackEnd:

- Install:
  ```
  cd BackEnd
  npm install
  ```
- Create `.env` file

  - create a `.env` file in the `BackEnd` folder
  - create a mongodb instance from mongodb atlas with cluster name: `mean-stack` and add following params to `.env` file

  ```
  MONGODB_URI_PRE = "mongodb+srv://"
  MONGODB_USER = <USER NAME>
  MONGODB_PASSWORD <PASSWORD>
  MONGODB_URI_POST = "@mean-cluster.qyd3m.mongodb.net/mean-stack?retryWrites=true&w=majority"
  JWT_SECRET_KEY = <STRING used for JWT Hashing>
  ```

  - It is ok to expose username and password by accident since only certain IP is added to IP while list

  - If not using mongodb atlas, please modify `BackEnd/app.js` file to configure mongodb correctly

- Run:
  ```
  npm start
  ```
