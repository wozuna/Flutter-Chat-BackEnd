const {io} = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
//Mensajes de Socket
io.on('connection', client=>{
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])
    
    //verificar autenticacion    
    if (!valido){ return client.disconnect();}

    //cliente autenticado
    usuarioConectado(uid);
    //console.log('cliente autenticado');
    //Ingresar al usuario a una sala especifica
    //sala global donde estan todos los dispositivos conectado
    client.join (uid);

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        //console.log(payload);
        //TODO: Grabar mensaje en la base de datos
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });


    client.on('disconnect', ()=>{
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });
    // client.on('mensaje', (payload)=>{
    //     console.log('Mensaje', payload);  
    //     io.emit('mensaje', {admin: 'nuevo mensaje'});
    // });
});