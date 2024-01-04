// api/sendMails.js

import nodemailer from 'nodemailer';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Email } from './email.html'
import axios from "axios";
import { useDispatch } from "react-redux";

const API_VERSION3 = "/api/v3";
const BASE_URL = "https://femsa-api.vercel.app";
const TOKEN = `Bearer JOSEBOZZONE`;
import moment from 'moment';

const sendMails = async () => {
    try {

        const response = await axios.get(BASE_URL + API_VERSION3 + "/back/process/uploaded_files", {
            headers: { Authorization: TOKEN },
        });
        const datos = response.data;
        const fechaHoy = moment().format('DD/MM/YYYY');
        console.log('data', datos)
        console.log('fechaHoy', fechaHoy)
        const ventaDirecta = datos.filter(obj => obj.type === "venta_directa");
        const ventaIndirecta = datos.filter(obj => obj.type === "venta_indirecta");
        const comercializadores = datos.filter(obj => obj.type === "comercializadores");
        const products = datos.filter(obj => obj.type === "products")
        console.log('ventaDirecta', ventaDirecta)
        try {
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

            let to = 'matiasacanton@gmail.com'
            let subject = 'TEST'
            let text = ''
            let html = { Email }

            /*`<Html lang="en">
                            <h1>Recordatorio de carga de archivos</h1>
                            <Button href="https://bo.femsa.ar/uploads">IR</Button>
                        </Html>`*/


            let info = await transporter.sendMail({
                from: `'TEST' <sistemas@femsa.ar>`, // sender address
                to, // list of receivers
                subject, // Subject line
                text, // plain text body
                html, // html body
            });
            console.log("Message senntttttttttt correct");


            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.log('error', err);
        }

        console.log('Envío de correos electrónicos realizado con éxito.');

    } catch (error) {
        console.error('Error al enviar correos electrónicos:', error);
    }
};

module.exports = sendMails;