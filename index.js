import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//para ver en pantalla con express - peticion 
app.use('/api/veterinarios', veterinarioRoutes);
//arrancar el serv en puerto 4000 para back, call 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
})
