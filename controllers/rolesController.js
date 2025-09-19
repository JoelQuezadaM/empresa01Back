import { pool } from "../config/db.js"

export const muestraRoles = async(req,res) =>{
    try{
        const [respuesta]= await pool.query('select * from roles')
        res.json(respuesta)
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al obtener roles' })
    }
}

