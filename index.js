const express = require('express');
const Sequelize = require('sequelize');

const databaseUrl = process.env.DATABASEURL || 'postgres://postgres:secret/localost:5432/postgres';

const db = Sequelize(databaseUrl)

db.sync({force:false})
   .then(() => console.log('database synced'))
   .catch((error) => console.error(error));

const app =  express()

const port = process.env.PORT || 4000

app.listen(port,() => console.log(`Listening to port ${port}`))
