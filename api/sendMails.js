// api/sendMails.js

import nodemailer from 'nodemailer';
import { createAsyncThunk } from "@reduxjs/toolkit";
//import { Email } from './email';
import axios from "axios";
import { useDispatch } from "react-redux";

const API_VERSION3 = "/api/v3";
const BASE_URL = "https://femsa-api.vercel.app";
const TOKEN = `Bearer JOSEBOZZONE`;

const getUploadedFiles = createAsyncThunk(
    "uploadsApp/getUploadedFiles",
    async () => {
        console.log('test1')
        const response = await axios.get(
            BASE_URL + API_VERSION3 + "/back/process/uploaded_files",
            {
                headers: { Authorization: TOKEN },
            }
        );
        const data = await response.data;
        return data;
    }
);

const sendMails = async () => {
    try {
        const dispatch = useDispatch();
        dispatch(getUploadedFiles()).then((resp) => {
            console.log('restpppp1111', resp.payload)
            let ventaDirecta = resp.payload.filter(obj => obj.type === "venta_directa");
            let ventaIndirecta = resp.payload.filter(obj => obj.type === "venta_indirecta");
            let comercializadores = resp.payload.filter(obj => obj.type === "comercializadores");
            let products = resp.payload.filter(obj => obj.type === "products")
        });

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
            let html = `<Html lang="en">
                            <h1>Recordatorio de carga de archivos</h1>
                            <Button href="https://bo.femsa.ar/uploads">IR</Button>
                        </Html>`


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