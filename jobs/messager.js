
const axios = require("axios");
const fetch = require('node-fetch')
const Sesion = require("../app/models/sesion.model");
const { parentPort } = require('worker_threads');

(async () => {
    var present_date = new Date();
    Sesion.getAllContactos((err, data) => {
      if (err) {
        console.log(err)
      } else {

        var interval = 20000; // how much time should the delay between two iterations be (in milliseconds)?
        var promise = Promise.resolve();
        data.forEach(function (value) {
          promise = promise.then(function () {
           
            var Difference_In_Time = present_date.getTime() - value.fecha_ultima_interaccion.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            console.log(Difference_In_Days);
            if(value.segundo_auto_mesaje_masivo_enviado == '0'){
              if(value.auto_mensaje_masivo_enviado == '1') {
                if(Difference_In_Days >= 60){
                  let apiKey = ''
                  let deviceId = ''
                  let scriptName = 'texto_libre'
  
                  if(value.asesor_id === 1) {
                    //benedicto
                    console.log('benedicto')
                    apiKey = '169ab9e615844a4a8eb568684e679243'
                    deviceId = 'dc870804ed09496bb86ec9c7be6dc3ff'
                  }
                  if(value.asesor_id === 2) {
                    //ebano
                    console.log('ebano')
                    apiKey = '10896fe04b7143189be93d6a47b85805'
                    deviceId = '4d9ad1708664485b84db73930bc444dc'
                  }
                  let body = {
                          "name": value.nombre,
                          "message": "Hola!☀️ Me preguntaba que tal estabas y como iba todo por ahi.",
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
                        var type = 'segundo_auto_mesaje_masivo_enviado'
                        Sesion.updateContactInteractionByName(value.nombre,utc,type, async (err, contactoUpdateado) => {
                          if (err) {
                            console.log('Hubo un error actualizando la ultima interaccion')
                          } else {
                            console.log('Ultimo mensaje masivo actualizado en la base de datos... ahora airtable')
                            getRecordByField(value.nombre, async (err,resultRecord) => {
                              if(err){
                                // console.log(err)
                                console.log('error')
                              }
                                const sesion = {
                                  fecha_ultimo_mensaje_masivo_enviado: now,
                                };
                                console.log('acutalizando record')
                                console.log(resultRecord)
                                await updateRecord(resultRecord.id, sesion)
                                console.log('sesion actualizada')
                            }) 
                          }
                        })
                      })
                      .catch(error => console.log('error', error));
                      console.log('Enviando a tasker...')
                }
              } else {
                if (Difference_In_Days > 30 && Difference_In_Days < 60) {
                  let apiKey = ''
                  let deviceId = ''
                  let scriptName = 'texto_libre'
  
                  if(value.asesor_id === 1) {
                    //benedicto
                    console.log('benedicto')
                    apiKey = '169ab9e615844a4a8eb568684e679243'
                    deviceId = 'dc870804ed09496bb86ec9c7be6dc3ff'
                  }
                  if(value.asesor_id === 2) {
                    //ebano
                    console.log('ebano')
                    apiKey = '10896fe04b7143189be93d6a47b85805'
                    deviceId = '4d9ad1708664485b84db73930bc444dc'
                  }
                  let body = {
                          "name": value.nombre,
                          "message": "Hola!☀️ Me preguntaba que tal estabas y como iba todo por ahi.",
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
                        var type = 'auto_mensaje_masivo_enviado'
                        Sesion.updateContactInteractionByName(value.nombre,utc,type, async (err, contactoUpdateado) => {
                          if (err) {
                            console.log('Hubo un error actualizando la ultima interaccion')
                          } else {
                            console.log('Ultimo mensaje masivo actualizado en la base de datos... ahora airtable')
                            getRecordByField(value.nombre, async (err,resultRecord) => {
                              if(err){
                                // console.log(err)
                                console.log('error')
                              }
                                const sesion = {
                                  fecha_ultimo_mensaje_masivo_enviado: now,
                                };
                                console.log('acutalizando record')
                                console.log(resultRecord)
                                await updateRecord(resultRecord.id, sesion)
                                console.log('sesion actualizada')
                            }) 
                          }
                        })
                      })
                      .catch(error => console.log('error', error));
                      console.log('Enviando a tasker...')
                }
              }
            } else {
              console.log('Ya se enviaron los dos mensajes a este usuario')
            }



            return new Promise(function (resolve) {
              setTimeout(resolve, interval);
            });
          });
        });
        
        promise.then(function () {
          console.log('Loop finished.');
        });


          // parentPort.postMessage('done');
      }
    });
})();




// for (let value of data) {

//   var Difference_In_Time = present_date.getTime() - value.fecha_ultima_interaccion.getTime();
//   // console.log(Difference_In_Time)
//   var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
//   // console.log(value);
//   console.log(Difference_In_Days);
//   // if (Difference_In_Days > 10 && Difference_In_Days < 60) {
//   if (Difference_In_Days > 30 && Difference_In_Days < 60) {
//     let apiKey = ''
//     let deviceId = ''
//     let scriptName = 'texto_libre'

//     if(value.asesor_id === 1) {
//       //benedicto
//       console.log('benedicto')
//       apiKey = '169ab9e615844a4a8eb568684e679243'
//       deviceId = 'dc870804ed09496bb86ec9c7be6dc3ff'
//     }
//     if(value.asesor_id === 2) {
//       //ebano
//       console.log('ebano')
//       apiKey = '10896fe04b7143189be93d6a47b85805'
//       deviceId = '4d9ad1708664485b84db73930bc444dc'
//     }
//     let body = {
//             "name": value.nombre,
//             "message": "Hola!☀️ Me preguntaba que tal estabas y como iba todo por ahi.",
//             // "name": `La Rosalia`,
//             // "message": "Hola!☀️ Me preguntaba que tal estabas y como iba todo por ahi.",
//         }
//         console.log(body)
//         console.log(apiKey)
//         console.log(deviceId)
//     var requestOptions = {
//       method: 'POST',
//       redirect: 'follow'
//       };
//     console.log(body)
//       fetch(`https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=${apiKey}&text=${encodeURIComponent(JSON.stringify(body))}&title=saokoooooo2&deviceId=${deviceId}`, requestOptions)
//         .then(response => response.text())
//         .then(result => console.log(result))
//         .catch(error => console.log('error', error));
//         console.log('Enviando a tasker...')

  
  
  
//   console.log('send message!')
//     // parentPort.postMessage('done');
//       //post to tasker
//       // const article = { title: 'Axios POST Request Example' };
//       // axios.post('https://reqres.in/api/articles', article)
//       // .then(response => console.log(response.data));
//   } else {
//     console.log('dont send anything!')
//   }
// }



  // var arr = []
  // function randomDate(start, end) {
  //   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  // }

  // var result = randomDate(new Date(2021, 0, 1), new Date())
  // arr.push(result)
  // var result1 = randomDate(new Date(2021, 0, 1), new Date())
  // arr.push(result1)
  // var result2 = randomDate(new Date(2022, 0, 1), new Date())
  // arr.push(result2)
  // var result3 = randomDate(new Date(2022, 0, 1), new Date())
  // arr.push(result3)
  // // console.log(arr)

  // var present_date = new Date();
  // for (let value of arr) {
  //   var Difference_In_Time = present_date.getTime() - value.getTime();
  //   var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  //   // console.log(value);
  //   // console.log(Difference_In_Days);
  //   if (Difference_In_Days > 30 && Difference_In_Days < 60) {
  //     console.log('send message!')
  //   }
  // }
