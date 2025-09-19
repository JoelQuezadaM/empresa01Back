import nodemailer from "nodemailer"

const emailRegistro = async(datos) => {
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
        subject: 'Comprueba tu cuenta',
        text:'Comprueba tu cuenta',
        html:`<p>Hola: ${nombre}, comprueba tu cuenta en el sistema de Almances.</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: <a href="${process.env.FRONTEND_URL1}/confirmar/${token}">Comprobar cuenta</a></p>
        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje </p>
        `
    });
  console.log("Mensaje enviado: %s",info.messageId)
}
export default emailRegistro

