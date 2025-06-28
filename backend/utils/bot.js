const fetch = require("node-fetch");
const TOKEN = "7617603406:AAHsXHxA8dxCRk7UuHy_f8vr5Uy5O8Cicew";
const ID_CHAT = "6750033330";

const enviarNotificacion = async(mensaje) =>{
   
    try{
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({chat_id: ID_CHAT, text:mensaje})
        })
        const data = await res.json();
        if(!data.ok) console.error("Error al enviar", data);
    }catch(error){
        console.error("ERROR AL ENVIAR EL MENSAJE:", error);
    }
}

module.exports = {enviarNotificacion};