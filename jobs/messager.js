
const axios = require("axios");
const fetch = require('node-fetch')
const Sesion = require("../app/models/sesion.model");
const { parentPort } = require('worker_threads');


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
        console.log('NO HAY NADA')
        result(null, err);
        return;
      }
      const minified = minifyRecord(records[0])

      result(null,minified);
      return;
  });
};

const updateRecord = async (id, fields) => {
  const updatedRecord = await tablaSesiones.update(id, fields);
  console.log(minifyRecord(updatedRecord));
};


(async () => {
  // const mensajeAutomatico = "Hola!☀️ Me preguntaba que tal estabas y como iba todo por ahi."
  var present_date = new Date();
  console.log('hola')
  Sesion.getAllMensajeAutomatico( async (err, foundMsg) => {
    if (err) {
      console.log(err)
    } else {
      const mensajeAutomatico = foundMsg[0].mensaje ? foundMsg[0].mensaje : "Hola!☀️ Me preguntaba que tal estabas y como iba todo por ahi."
      Sesion.getAllContactos((err, data) => {
        if (err) {
          console.log(err)
        } else {
          var interval = 1;
          var intervaltwo = 120000; 
          let toSend = []
          var promise = Promise.resolve();
          data.forEach(function (value) {
            promise = promise.then(function () {
             
              var Difference_In_Time = present_date.getTime() - value.fecha_ultima_interaccion.getTime();
              var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        
              function subtractHours(numOfHours, date = new Date()) {
                date.setHours(date.getHours() - numOfHours);
              
                return date;
              }
              const resultUTCtoArg = subtractHours(3);
              // var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
              if(value.segundo_auto_mesaje_masivo_enviado == '0'){
                if(value.auto_mensaje_masivo_enviado == '1') {
                  if(Difference_In_Days >= 60){
                    value.type = 'Two'
                    
                    toSend.push(value)
      
                    console.log(Difference_In_Days);
                    console.log('60');
                  }
                } else {
                  if (Difference_In_Days > 30 && Difference_In_Days < 60) {
                    value.type = 'One'
                    toSend.push(value)
                    console.log(Difference_In_Days);
                    console.log('30');
                  }
                }
              } else {
                console.log('No le toca enviar mensaje')
              }
      
              return new Promise(function (resolve) {
                setTimeout(resolve, interval);
              });
            });
          });
          
          promise.then(function () {
            console.log('Loop finished Now send msgs.');
            console.log(toSend.length)
            if(toSend.length > 30) {
              toSend = toSend.slice(0, 30);
              console.log('hay mas de 30 contactos para contactar')
              console.log(`ahora seran ${toSend.length}`)
            }
            var promiseTwo = Promise.resolve();
            toSend.forEach(function (contact) {
              promiseTwo = promiseTwo.then(function () {
      
                if(contact.type === 'One') {
                  let apiKey = ''
                  let deviceId = ''
                  let scriptName = 'texto_libre_nombre'
                  // let scriptName = 'texto_libre'
                  if(contact.asesor_id === 1) {
                    //ambrosia
                    console.log('ambrosia')
                    apiKey = 'a66107c81d1b4e51a6ecd7efc7bdeb1e'
                    deviceId = '7251893c89734549ad2c0daabb71acbb'
                  }
                  if(contact.asesor_id === 2) {
                    //benedicto
                    console.log('benedicto')
                    apiKey = '169ab9e615844a4a8eb568684e679243'
                    deviceId = 'dc870804ed09496bb86ec9c7be6dc3ff'
                  }
                  if(contact.asesor_id === 3) {
                    //ebano
                    console.log('ebano')
                    apiKey = '10896fe04b7143189be93d6a47b85805'
                    deviceId = '4d9ad1708664485b84db73930bc444dc'
                  }
                  let body = {
                          "name": contact.nombre,
                          "message": mensajeAutomatico,
                      }
                      console.log(body)
                      console.log(apiKey)
                      console.log(deviceId)
                  var requestOptions = {
                    method: 'POST',
                    redirect: 'follow'
                    };
                  console.log(body)
      
                    fetch(`https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=${apiKey}&text=${encodeURIComponent(JSON.stringify(body))}&title=${scriptName}&deviceId=${deviceId}`, requestOptions)
                      .then(response => response.text())
                      .then(result => {
                        console.log('MENSAJE ENVIADO')
                        console.log(result)
                        var type = 'auto_mensaje_masivo_enviado'
                        var now = new Date();
                        var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                        Sesion.updateContactInteractionByName(contact.nombre,utc,type, async (err, contactoUpdateado) => {
                          if (err) {
                            console.log('Hubo un error actualizando la ultima interaccion')
                          } else {
                            console.log('Ultimo mensaje masivo actualizado en la base de datos... ahora airtable')
             
                            getRecordByField(contact.nombre, async (err,resultRecord) => {
                              if(err){
                                // console.log(err)
                                console.log('error')
                              }
                              try {
                                var dateAirtable = utc.toLocaleDateString('en-US')
                                const sesion = {
                                  fecha_ultimo_mensaje_masivo_enviado: dateAirtable,
                                };
                                await updateRecord(resultRecord.id, sesion)
                              } catch (error) {
                                console.log(error)
                              }
                            }) 
                          }
                        })
                      })
                      .catch(error => console.log('error', error));
                      console.log('Enviando a tasker...')
                }
                if(contact.type === 'Two') {
                  let apiKey = ''
                  let deviceId = ''
                  let asesor = ''
                  let scriptName = 'texto_libre'
                  if(contact.asesor_id === 1) {
                    //ambrosia
                    console.log('ambrosia')
                    apiKey = 'a66107c81d1b4e51a6ecd7efc7bdeb1e'
                    deviceId = '7251893c89734549ad2c0daabb71acbb'
                  }
                  
                  if(contact.asesor_id === 2) {
                    //benedicto
                    console.log('benedicto')
                    asesor = 'benedicto'
                    apiKey = '169ab9e615844a4a8eb568684e679243'
                    deviceId = 'dc870804ed09496bb86ec9c7be6dc3ff'
                  }
                  if(contact.asesor_id === 3) {
                    //ebano
                    console.log('ebano')
                    apiKey = '10896fe04b7143189be93d6a47b85805'
                    deviceId = '4d9ad1708664485b84db73930bc444dc'
                    asesor = 'ebano'
                  }
                  let body = {
                          "name": contact.nombre,
                          "message": mensajeAutomatico,
                      }
                      console.log(body)
                      console.log(asesor)

                  var requestOptions = {
                    method: 'POST',
                    redirect: 'follow'
                    };
                  console.log(body)    
                    fetch(`https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=${apiKey}&text=${encodeURIComponent(JSON.stringify(body))}&title=${scriptName}&deviceId=${deviceId}`, requestOptions)
                      .then(response => response.text())
                      .then(result => {
                        console.log('MENSAJE ENVIADO')
                        console.log(result)
                        var type = 'segundo_auto_mesaje_masivo_enviado'
                        var now = new Date();
                        var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                        Sesion.updateContactInteractionByName(contact.nombre,utc,type, async (err, contactoUpdateado) => {
                          if (err) {
                            console.log('Hubo un error actualizando la ultima interaccion')
                          } else {
                            console.log('Ultimo mensaje masivo actualizado en la base de datos... ahora airtable')
                            console.log(contact.nombre)
                            getRecordByField(contact.nombre, async (err,resultRecord) => {
                              if(err){
                                console.log('error');
                              }
                                try {
                                  
                                  var dateAirtable = utc.toLocaleDateString('en-US')
                                  const sesion = {
                                    fecha_ultimo_mensaje_masivo_enviado: dateAirtable,
                                  };
                                  await updateRecord(resultRecord.id, sesion)
                                  console.log('acutalizando record')
                              
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
                }
                return new Promise(function (resolve) {
                  setTimeout(resolve, intervaltwo);
                });
              });
            });
            
            promiseTwo.then(function () {
              parentPort.postMessage('done')
              console.log('Envio de mensajes terminado.');
            });
      
          });
      
      
        }
      });
    }
  });
})();




