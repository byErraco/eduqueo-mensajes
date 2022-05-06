const fetch = require('node-fetch')
const Sesion = require("../models/sesion.model.js");


const Airtable = require('airtable');
//prod
const base = new Airtable({ apiKey: 'keychMsGE74MU7aPW' }).base(
  'appLozC8HlQpY5OGi'
);
//dev
// const base = new Airtable({ apiKey: 'keyaSZubvuicnMRyO' }).base(
//   'app5VPWEzWCR4bUbe'
// );
const tabletest = base('PricelistNob2021');

const tablaSesiones = base('Sesiones');


//airtable
const minifyRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};
const getRecords = async () => {
  const records = await tabletest
    // .select({ maxRecords: 3, view: 'All projects' })
    .select({ maxRecords: 3 })
    .firstPage();
    // console.log(minifyRecord(records))
  return records
  // console.log(records);
};

//tablaSesiones crear
const createRecord = async (fields) => {
  const createdRecord = await tablaSesiones.create(fields);
  // console.log(minifyRecord(createdRecord));
  return minifyRecord(createdRecord)
};

const updateRecord = async (id, fields) => {
  const updatedRecord = await tablaSesiones.update(id, fields);
  console.log(minifyRecord(updatedRecord));
};


const getRecordByField = async (field, result) => {
  const record = await tablaSesiones.select({
      filterByFormula: `{nombre_unico} = "${field}"`
  }).firstPage(function(err,records) {
      if(err) {
          console.log("error: ", err);
          result(null, err);
          return;
      }
      if(records.length === 0){
        result(null, err);
        return;
      }
      const minified = minifyRecord(records[0])
      result(null,minified);
      return;
  });
};

exports.airtableMensajes = async (req,res) => {

  const arrClientes = req.body.arr
  // const mensaje = req.body.mensaje

  console.log(arrClientes)
  

  let apiKey = ''
  let deviceId = ''
  let scriptName = 'texto_libre_nombre'
  var requestOptions = {
  method: 'POST',
  redirect: 'follow'
  };

  arrClientes.forEach((cliente, i) => {
    setTimeout(() => {
      if(cliente.asesorId === "1") {
        //benedicto
        console.log('benedicto')
        apiKey = '169ab9e615844a4a8eb568684e679243'
        deviceId = 'dc870804ed09496bb86ec9c7be6dc3ff'
      }
      if(cliente.asesorId === '2') {
        //ebano
        console.log('ebano')
        apiKey = '10896fe04b7143189be93d6a47b85805'
        deviceId = '4d9ad1708664485b84db73930bc444dc'
      }
      let body = {
              "name": cliente.clienteNombre,
              "message": cliente.texto,
              // "message": mensaje,
          }

          function subtractHours(numOfHours, date = new Date()) {
            date.setHours(date.getHours() - numOfHours);
          
            return date;
          }
          var resultUTCtoArg = subtractHours(3);
          resultUTCtoArg = resultUTCtoArg.toISOString()
      
          console.log(body)
        fetch(`https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=${apiKey}&text=${encodeURIComponent(JSON.stringify(body))}&title=${scriptName}&deviceId=${deviceId}`, requestOptions)
          .then(response => response.text())
          .then(result => {

            console.log(result)
            var now = new Date();
            var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            console.log(`Mensaje enviado aprox a las ${resultUTCtoArg}`)
            //update contact in the db (amount of interactions and last date of interaction)
           
            Sesion.updateContactInteractionByNameNoType(cliente.clienteNombre,utc, async (err, contactoUpdateado) => {
              if (err) {
                console.log('Hubo un error actualizando la ultima interaccion')
              } else {
                console.log('Ultimo contacto actualizado en la base de datos... ahora airtable')
                getRecordByField(cliente.clienteNombre, async (err,resultRecord) => {
                  if(err){
                    console.log('error')
                  }
                    const sesion = {
                      fecha_ultimo_mensaje_masivo_enviado: utc,
                      
                      // fecha_ultimo_mensaje_masivo_enviado: now,
                      // fecha_ultimo_mensaje_masivo_enviado: utc,
                      //actualizar cantidad de interacciones?
                      // cantidad_interacciones: dataMsg.length,
                    };
                    console.log('acutalizando record')
                    console.log(resultRecord)
                    try {
                      await updateRecord(resultRecord.id, sesion)
                    } catch (error) {
                      console.log(error)
                    }
                    console.log('sesion actualizada')
                }) 
              }
            })
          })
          .catch(error => console.log('error', error));
          console.log('Enviando a tasker...')

    }, i * 60000);
  });



  res.status(200).send('Recibido')
}

// Crear y guardar nueva sesion
//revisar si se puede cambiar el campo en airtable a q sea date y no string
exports.saveMsg = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return
  }
  const {nombre_contacto} = req.body
  if (nombre_contacto.includes('Equipo Eduqueo')) {
    console.log( "Equipo eduqueo no aceptado!")
    res.status(400).send({
      message: "Equipo eduqueo no aceptado!"
    });
    return
  }
  const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
  if (regexExp.test(nombre_contacto)) {
    console.log("No se aceptan contactos con emojis!")
    res.status(400).send({
      message: "No se aceptan contactos con emojis!"
    });
    return
  }
  console.log(req.body)

  var now = new Date();
  var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  function subtractHours(numOfHours, date = new Date()) {
    date.setHours(date.getHours() - numOfHours);
  
    return date;
  }
  const resultUTCtoArg = subtractHours(3);

  console.log(`mensaje recibdo hora: ${resultUTCtoArg}`)

  Sesion.getContactByName(nombre_contacto, async (err, contact) => {
    if (err) {
      console.log(err)
    }
    if(contact == 'no existe') {
      var es_cliente 
      if(nombre_contacto.startsWith("AA")) {
        es_cliente = true
      } else {
        es_cliente = false
      }


      const nuevoContacto = new Sesion({
        fecha_primera_interaccion: resultUTCtoArg,
        fecha_ultima_interaccion: resultUTCtoArg,
        fecha_ultimo_mensaje_masivo_enviado: null,
        // fecha_ultimo_mensaje_masivo_enviado: resultUTCtoArg,
        nombre: nombre_contacto,
        es_cliente: es_cliente,
        // es_cliente: req.body.es_cliente || false,
        cantidad_interacciones: 1,
        asesor_id: req.body.asesor_id
      });
        // Save Contact in the database
      Sesion.createContact(nuevoContacto, async (err, contactoCreado) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the contact."
          });
        else {
          console.log('Nuevo contacto!')
          console.log(contactoCreado)
          console.log('Saving mensaje!')
          const newMsg = {
            id_celular: req.body.asesor_id,
            mensaje: req.body.mensaje,
            id_contacto: contactoCreado.id,
            fecha:resultUTCtoArg
          };
          Sesion.createMensaje(newMsg, async (err, mensajeCreado) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while saving the msg."
              });
            else {
              console.log('Nuevo Msg!')
              console.log(mensajeCreado)
              res.send('Mensaje Creado!')
            }
          });
        }
      });
    } else {
      console.log('vamos a updatear a')
      console.log(contact[0])
      var es_cliente 
      if(nombre_contacto.startsWith("AA")) {
        es_cliente = true
      } else {
        es_cliente = false
      }
      const updateContacto = new Sesion({
        fecha_ultima_interaccion: utc,
        cantidad_interacciones: 1,
        es_cliente: es_cliente,
      });
      //update contact in the db (amount of interactions and last date of interaction)
      Sesion.updateContactInteraction(contact[0].id,updateContacto, async (err, contactoUpdateado) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while updating the contact."
          });
        else {
          console.log('Contacto updateado!')
          console.log('Saving mensaje!')
          const newMsg = {
            id_celular: req.body.asesor_id,
            mensaje: req.body.mensaje,
            id_contacto: contact[0].id,
            fecha:resultUTCtoArg
          };
          Sesion.createMensaje(newMsg, async (err, mensajeCreado) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while saving the msg."
              });
            else {
              console.log('Nuevo Msg!')
              console.log(mensajeCreado)
              res.send('Mensaje Creado!')
            }
          });
        }
      });

    } 
  });



};

