import { pool} from "../config/db.js"


export const mostrarPedidoDetalles = async(req,res)=>{
    //res.json({msg:"Mostrando los pedidos"})
    console.log('entrando a detalles')
    const {id_pedido}= req.params;
    try{

        // const [respuesta] = await pool.query('select * from pedido_detalle where id_pedido = ?',[id_pedido])
        const [respuesta] = await pool.query('select id_pedido_detalle,id_pedido,id_producto,cantidad,precio_unitario,subtotal,productos.nombre from pedido_detalle left join productos on pedido_detalle.id_producto = productos.id where id_pedido = ?',[id_pedido])

        console.log(respuesta)
        res.json(respuesta)
    }catch (error){
        console.log(error)
    }
}

export const insertarPedidoDetalles = async(req,res)=>{
    console.log('insertando back ')
    console.log(req.params)
    const {id_pedido,cantidad,precio_unitario,id_producto}=req.body;
    // const {id} = req.params;
   try {
        const [respuesta] =  await pool.query('insert into pedido_detalle (id_pedido,cantidad,precio_unitario,id_producto) values (?,?,?,?)',[id_pedido,cantidad,precio_unitario,id_producto])
        console.log('despues query')
        console.log(respuesta)
        res.json(respuesta)
   } catch (error) {
        console.log(error)
   }
}

export const actualizarPedidoDetalle = async(req,res)=>{
    console.log('actualizando')


    const {id_pedido_detalle} = req.params;
    const [pedido_detalle]= await pool.query('select * from pedido_detalle where id_pedido_detalle =? ',[id_pedido_detalle]);
    console.log('dentro del back')
    //!!!tambien deberian de checar si existe el id_producto
    if (pedido_detalle.length>0){
        let id_producto = req.body.id_producto;
        let cantidad = req.body.cantidad;
        let precio_unitario = req.body.precio_unitario;

        const [modificado] =await pool.query('update pedido_detalle set id_producto =?,cantidad =?, precio_unitario =? where id_pedido_detalle =?',[id_producto,cantidad,precio_unitario,id_pedido_detalle])
        console.log('modificado')
        console.log(modificado)
        res.json(modificado)
    }else{
        res.status(404).json({msg:"No encontrado"})
    }
}


export const eliminarPedidoDetalles = async(req,res) => {
    console.log('eliminando detalle')

    const {id_pedido_detalle} = req.params;
    console.log(id_pedido_detalle)
    const [pedidoDetalle]= await pool.query('select * from pedido_detalle where id_pedido_detalle =?',[id_pedido_detalle]);
    console.log('mostrando del detalle')
    console.log(pedidoDetalle)
    if (pedidoDetalle.length>0){
        await pool.query('delete from pedido_detalle  where id_pedido_detalle =? ',[id_pedido_detalle])
        console.log('si se elimino')
        res.json({msg:'Detalle eliminado'})
    }else{
        res.status(404).json({msg:"No encontrado"})
    }

}