import { pool } from "../config/db.js"

export const mostrar = async(req,res)=>{
    // res.json({msg:"Mostrando los productos"})

    try{
        const [respuesta] = await pool.query('select * from productos')
        console.log(respuesta)
    }catch (error){
        console.log(error)
    }
}

export const insertarProducto = async (req,res) => {
    const {codigo,nombre,existencias,almacen,Precio,foto}=req.body;
    console.log('insertando')
    try{
        const [result] = await pool.query('insert into productos (codigo,nombre,existencias,almacen,precio,foto) values (?,?,?,?,?,?)',[codigo,nombre,existencias,almacen,Precio,foto])
        console.log('primer query')
        console.log(result)
        const [rows] = await pool.query('select * from productos where id = ?',[result.insertId])
        console.log('id')
        console.log(rows[0])
        res.json(rows[0])
    }catch(error){
        console.log(error)
    }
}

export const obtenerProductos = async (req,res)=>{
   try{
        const [respuesta] = await pool.query('select * from productos')
        console.log(respuesta)
        res.json(respuesta)
   } catch(error){
    console.log(error)
   }
}

export const actualizarProducto = async(req,res) =>{
        console.log('entro a actualizar')
        const {id} = req.params
        const [producto] = await pool.query('select * from productos where id = ?',id)
        if (producto.length>0){
            let codigoProducto = req.body.codigo
            let nombreProducto = req.body.nombre
            let existencias = req.body.existencias
            let almacen = req.body.almacen
            let Precio = req.body.Precio
            let foto = req.body.foto

            const [modificado] = await pool.query('update productos set codigo =?, nombre =?, existencias=?, almacen =?, Precio=?, foto=?  where id=?',[codigoProducto,nombreProducto,existencias,almacen,Precio,foto,id])
            res.json(modificado)
        }else{
            res.status(404).json({msg:"No encontrado"})
        }
}

export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Ejecuta la eliminación directamente y obtiene el número de filas afectadas
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        // Verifica si se eliminó al menos una fila
        if (result.affectedRows > 0) {
            res.json({ msg: 'Producto eliminado' });
        } else {
            res.status(404).json({ msg: 'No encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};