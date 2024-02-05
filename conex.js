const express = require("express");
const path = require("path");
const sql = require("mssql");

const app = express();

const config = {
    server: "GENESIS",
    database: "Git",
    user: "Gene",       
    password: "1234",   
    options: {
        encrypt: true,            
        trustServerCertificate: true  
    }
};

sql.connect(config, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connection exitosa");
    }
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname));

app.post("/validar", function (req, res) {
    const datos = req.body;

    console.log("Received data:", datos);

    // Ensure required fields are present in req.body
    if (
        datos.nombreapellido &&
        datos.correoelectronico &&
        datos.telefono &&
        datos.mensaje &&
        datos.contacto &&
        datos.horario_preferido &&
        datos.recibir_novedades !== undefined
    ) {
        let nombreapellido = datos.nombreapellido;
        let correoelectronico = datos.correoelectronico;
        let telefono = datos.telefono;
        let mensaje = datos.mensaje;
        let contacto_preferido = datos.contacto;
        let horario_preferido = datos.horario_preferido;
        let recibir_novedades = datos.recibir_novedades === 'on' ? 1 : 0;

        let registrar = `INSERT INTO FormularioContacto (nombre_apellido, correo_electronico, telefono, mensaje, contacto_preferido, horario_preferido, recibir_novedades) VALUES ('${nombreapellido}', '${correoelectronico}', '${telefono}', '${mensaje}', '${contacto_preferido}', '${horario_preferido}', ${recibir_novedades})`;

        sql.query(registrar, function (error) {
            if (error) {
                console.error("Error al insertar datos:", error);
                res.status(500).send("Error al insertar datos");
            } else {
                console.log("Datos ingresados con éxito");
                // Redirect to the contacto.html page
                res.redirect("/contacto.html");
                // Add a return statement to terminate the function
                return;
            }
        });
    } else {
        console.error("Datos incompletos en la solicitud");
        res.status(400).send("Datos incompletos en la solicitud");
    }
});




app.listen(3000, function() {
    console.log("Servidor creado http://localhost:3000");
});
