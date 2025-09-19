import { pool} from "../config/db.js"


export const mostrarPedidos = async(req,res)=>{
    //res.json({msg:"Mostrando los pedidos"})
    try{
        // const [respuesta] = await pool.query('select id_pedido,id_cliente,fecha,total,clientes.nombre from pedidos left join clientes on pedidos.id_cliente = clientes.id')
        const [respuesta] = await pool.query('select id_pedido,id_cliente,fecha,total,clientes.nombre from pedidos left join clientes on pedidos.id_cliente = clientes.id')
        console.log('mostrando pedidos')
        console.log(respuesta)
        res.json(respuesta)
    }catch (error){
        console.log(error)
    }
}

export const mostrarUnPedido = async(req,res)=>{
    try{
        const {id_pedido} = req.params;
        
        console.log('mostrando un pedido')
        console.log(id_pedido)
        const [respuesta] = await pool.query('select id_pedido,id_cliente,fecha,total,clientes.nombre from pedidos left join clientes on pedidos.id_cliente = clientes.id where id_pedido = ?',id_pedido)
        console.log(respuesta)
        res.json(respuesta)
    }catch (error){
        console.log(error)
    }
}

export const agregarPedido = async(req,res)=>{
    const {id_cliente,fecha,estatus}= req.body;
    
    //primero debemos verificar que no exista un cliente con ese correo
    const [respuesta] = await pool.query('select * from clientes where id =?',[id_cliente]);
    if (respuesta.length<=0){//si regresa mas de 0 es que existe un cliente con ese correo
        const error = new Error("No existe el cliente.");
        return res.status(400).json({msg:error.message})
    }
    try {
        const [result] = await pool.query('insert into pedidos (id_cliente,fecha,estatus) values (?,?,?)',[id_cliente,fecha,estatus] )
        console.log('insertando')
        console.log(result.insertId)
        res.json(result.insertId)  
    } catch (error) {
        console.log(error)
    }
};

export const actualizarPedido = async(req,res)=>{
    console.log('entrar a actualizar')
    const {id_pedido,id_cliente,fecha,estatus}= req.body;
    
    //primero debemos verificar que no exista un cliente con ese correo
    const [respuesta] = await pool.query('select * from clientes where id =?',[id_cliente]);
    if (respuesta.length<=0){//si regresa mas de 0 es que existe un cliente con ese correo
        const error = new Error("No exise el cliente.");
        return res.status(400).json({msg:error.message})
    }
    const [respuesta2] = await pool.query('select * from pedidos where id_pedido =?',[id_pedido]);
    if (respuesta2.length<=0){//si regresa mas de 0 es que existe un cliente con ese correo
        const error = new Error("No se encontro el pedido");
        return res.status(400).json({msg:error.message})
    }

    try {
        await pool.query('update pedidos set id_cliente=?, fecha=?,estatus=? where id_pedido=?',[id_cliente,fecha,estatus,id_pedido])
        res.json(req.body)  
    } catch (error) {
        console.log(error)
    }
};

// export const eliminarPedido = async(req,res)=>{
//     console.log('entrando a eliminar pedido')
//     const {id_pedido} = req.params;
//     console.log(id_pedido)
//     const [pedido]= await pool.query('select * from pedidos where id_pedido =?',[id_pedido]);
//     if (pedido.length>0){
//         await pool.query('delete from pedidos  where id_pedido =? ',[id_pedido])
//         res.json({msg:'Pedido eliminado'})
//     }else{
//         res.status(404).json({msg:"No encontrado"})
//     }
// }

export const eliminarPedido = async (req, res) => {
    try {
        const { id_pedido } = req.params;
        // Ejecuta la eliminación directamente y obtiene el número de filas afectadas
        const [result] = await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id_pedido]);
        // Verifica si se eliminó al menos una fila
        if (result.affectedRows > 0) {
            res.json({ msg: 'Pedido eliminado' });
        } else {
            res.status(404).json({ msg: 'No encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};