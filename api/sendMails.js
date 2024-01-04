// api/sendMails.js

import nodemailer from 'nodemailer';
//import { Email } from './email';



const sendMails = async () => {
    try {

        // Lógica de envío de correos electrónicos aquí

        // Mensaje para imprimir en la consola
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "email-smtp.us-east-1.amazonaws.com",
                port: "587",
                auth: {
                    user: "AKIAWTE57ZETFQ6CVKGI",
                    pass: "BCVJVEtchcpMirwH8Sp5UrrZZoUtHB7seWPTlIijRX/+",
                },
                secureConnection: false,
                tls: {
                    rejectUnauthorized: true,
                    minVersion: "TLSv1.2"
                },
            });
            // esto lo generaliza
            // auth: {
            //   user:procces.env.Email, "patricio.dfernandez@gmail.com", // generated ethereal user
            //   pass:process.env.PASSORD "xztu fijl qljr btzh", // generated ethereal password
            // },
            let to = 'matiasacanton@gmail.com'
            let subject = 'TEST'
            let text = ''
            let html = `<Html lang="en">
            <Button href={url}>Click me</Button>
          </Html>`

            // '"Se registro " <usuariologueado@g.com>'l
            // send mail with defined transport object



            let info = await transporter.sendMail({
                from: `'TEST' <sistemas@femsa.ar>`, // sender address
                to, // list of receivers
                subject, // Subject line
                text, // plain text body
                html, // html body
            });
            console.log("Message senntttttttttt correct");

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.log('error', err);
        }
        console.log('Envío de correos electrónicos realizado con éxito.');
        console.log('----------------------------------.');

        // Mensaje para escribir en un archivo


    } catch (error) {
        // Manejar errores aquí

        // Imprimir errores en la consola y en el archivo
        console.error('Error al enviar correos electrónicos:', error);
    }
};

module.exports = sendMails;