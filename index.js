const express = require('express');
const path = require('path');
const { Client } = require('socket.io');
require('dotenv').config();

//DB Config
require('./database/config').dbConnection();

//App de express 
const app = express();


//Lectura y parseo de body
app.use(express.json());

//Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket')

//path publicp
const publicPath = path.resolve(__dirname, 'public');
app.use (express.static(publicPath));

//definicion de rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));

server.listen(process.env.PORT, (err)=> {
    if (err) throw new Error(err);
    console.log('Servidor corriendo en puerto', process.env.PORT);
} );