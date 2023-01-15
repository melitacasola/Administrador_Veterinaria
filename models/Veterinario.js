import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

// estructura de los datos de models veterinario
const veterinarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String, 
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarId()
    },
    confirmado:{
        type: Boolean,
        default: false
    },
});

//no usamos arrow funct xq vtana global ,  si function xq usaremos this
veterinarioSchema.pre('save', async function(next){
    //si esta hasheado no volver a hashear - asi puede autenticar
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    //reescribir obj (respetando lo qe quiere el user, pero hashemos con salt)
    this.password = await bcrypt.hash(this.password, salt)
});

//comprobar pass con METHODS 
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}

//registrar en mongoose el schema
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario; 