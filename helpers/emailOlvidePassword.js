import nodemailer from "nodemailer"

const emailOlvidePassword = async(datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    const {email, nombre, token}= datos;

    //enviar el email
    console.log('desde el nodemailer')
    console.log(process.env.EMAIL_HOST)
    const info = await transport.sendMail({
        from: "Sistema de almacenes",  
        to: email,
        subject: 'Reestablece tu Password',
        text:'Reestablece tu Password',
        html:`<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: <a href="${process.env.FRONTEND_URL1}/olvide-password/${token}">Reestablecer Password</a></p>
        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje </p>
        `
    });
  console.log("Mensaje enviado: %s",info.messageId)
}
export default emailOlvidePassword

