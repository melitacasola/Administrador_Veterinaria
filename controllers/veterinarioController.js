import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";

//ordenar routes con controllers

const registrar = async (req, res) => {
    //req.body --> p/enviar un formulario
    const {email } = req.body;

    // Prevenir usuarios registrados
    const existeUsuario = await Veterinario.findOne({ email })
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message})
    }

    try {
        //Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json({perfil: veterinario});
};

const confirmar = async (req, res) => {
    //req.params --> leer datos url + nombre del parametro dinamico
    const { token } = req.params
    const usuarioConfirmar = await Veterinario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()

        res.json({ msg: "Usuario Confirmado Correctamente"});
    } catch (error) {
        console.log(error);  
    }
};

const autenticar = async (req, res) =>{
    const {email, password} = req.body

    //comprobar si user existe
    const usuario = await Veterinario.findOne({email})
    if(!usuario){
        const error = new Error('El Usuario no existe')
        return res.status(403).json({msg: error.message})
    }

    //comprobar si el ususario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    //Corroborar password
    if(await usuario.comprobarPassword(password)){

        //Autenticar con json web token
        res.json({token: generarJWT(usuario.id)});
    } else{
        const error = new Error('El password es incorrecto')
        return res.status(403).json({msg: error.message})
    }
};

const recuperarPassword = async (req, res) =>{
    const { email } =  req.body
    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error("El Usuario no existe")
        return res.status(400).json({msg: error.message});
    };
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()
        res.json({msg: "Hemos enviado un correo electronico con las instrucciones"})
    } catch (error) {
        console.log(error);
    }
};
const comprobarToken = async (req, res) =>{
    const {token} = req.params
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        // El Token es Válido, el ususario existe
        res.json({msg: "Token Válido y el User existe"})
    }else{
        const error = new Error('Token no válido')
        return res.status(400).json({msg: error.message});
    }
};
const nuevoPassword = async (req, res) =>{
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Ocurrió un Error')
        return res.status(400).json({msg: error.message});
    }
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"})
    } catch (error) {
        console.log(error);
    }
};

export {
    registrar, 
    perfil,
    confirmar,
    autenticar,
    recuperarPassword,
    comprobarToken, 
    nuevoPassword

}