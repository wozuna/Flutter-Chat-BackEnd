const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req,res = response) =>{
   const { email, password } = req.body;
   try {
        const existeEmail = await Usuario.findOne({ email });
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya esta registrado'
            })
        }
        const usuario = new Usuario(req.body);
        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
         await usuario.save();
         //Generar un JWT
        const token = await generarJWT(usuario.id);
        res.json({
            ok:true,
            usuario,
            token
        });
   } catch (error) {
       console.log(error);
       res.status(500).json({
           ok:false,
           msg:'Hable con el administrador'
       });
   }
}

const login = async (req,res = response)=>{
    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }

        //valida el password
        const validaPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validaPassword){
            return res.status(400).json({
                ok:false,
                msg:'La contraseña no es valida'
            });
        }

        //General el JWT
        const token = await generarJWT(usuarioDB.id)

        return res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }



}



const renewToken = async ( req, res = response) =>{

    //obtener el uid del usuario
    const uid = req.uid;

    //generar un nuevo jwt
    const token = await generarJWT(uid);

    //obtener el usuario por el UID Usuario.findbyid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });

}




module.exports ={
    crearUsuario,
    login,
    renewToken
}