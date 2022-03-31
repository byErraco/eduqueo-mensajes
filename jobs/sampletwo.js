
const axios = require("axios");
const Sesion = require("../app/models/sesion.model");
const Airtable = require('airtable');
const { parentPort } = require('worker_threads');

const base = new Airtable({ apiKey: 'keyaSZubvuicnMRyO' }).base(
  // 'appqvc1jKHBIRRbSy'
  'app5VPWEzWCR4bUbe'
);
const tablaSesiones = base('Sesiones');

//airtable
const minifyRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
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



(async () => {
    console.log('Getting all contacts')

    Sesion.getAllContactos(async (err, data) => {
      if (err) {
        console.log(err)
      } else {


        function updateCreateSesion(obj) {
          return new Promise((resolve, reject) => {
            Sesion.getMsgById(obj.id, async (err, dataMsg) => {
              if (err) {
                console.log(err)
              } else {
                var es_cliente 
                console.log(obj)
                if(obj.es_cliente === 1) {
                  es_cliente = true
                  console.log('a')
                } else {
                  if(obj.nombre.startsWith("AA")) {
                    es_cliente = true
                    console.log('aa')
                  } else {
                    es_cliente = false
                    console.log('aaa')
                  }
                }
  
                const sesion = {
                  nombre_unico: `${obj.nombre}`,
                  asesor_id: obj.asesor_id,
                  // nombre_unico: `${value.nombre}-${value.id}`,
                  contacto_inicio: obj.fecha_primera_interaccion,
                  ultimo_contacto: obj.fecha_ultima_interaccion,
                  fecha_ultimo_mensaje_masivo_enviado: obj.fecha_ultimo_mensaje_masivo_enviado,
                  cantidad_interacciones: dataMsg.length,
                  cliente: es_cliente
                  // cliente: obj.es_cliente == 0 ? false : true
                };
                // console.log(sesion)
                getRecordByField(sesion.nombre_unico, async (err,resultRecord) => {
                  if(err){
                    // console.log(err)
                    console.log('error')
                  }
                  if(resultRecord) {
                    console.log('acutalizando record')
                    console.log(resultRecord)
                    try {
                      await updateRecord(resultRecord.id, sesion)
                      console.log('sesion actualizada')
                      resolve()
                    } catch (error) {
                      console.log('error actualizando sesion')
                    }
                  } else {
                    console.log('crear nuevo record')
                    try {
                      await createRecord(sesion)
                      resolve()
                    } catch (error) {
                      console.log('error!')
                      console.log(error)
                    }
                  }
                })  
              }
            });
          });
        }

        let promiseArr = [];
        data.forEach(obj => promiseArr.push(updateCreateSesion(obj)));
        Promise.all(promiseArr)
          .then((res) => {
            console.log('Listo aqui')
            parentPort.postMessage('done');
          })
          .catch(err => console.log(res))


        // data.map( async(value,index) => {
        //   Sesion.getMsgById(value.id, async (err, dataMsg) => {
        //     if (err) {
        //       console.log(err)
        //     } else {
        //       var es_cliente 
        //       console.log(value)
        //       if(value.es_cliente === 1) {
        //         es_cliente = true
        //         console.log('a')
        //       } else {
        //         if(value.nombre.startsWith("AA")) {
        //           es_cliente = true
        //           console.log('aa')
        //         } else {
        //           es_cliente = false
        //           console.log('aaa')
        //         }
        //       }

        //       const sesion = {
        //         nombre_unico: `${value.nombre}`,
        //         asesor_id: value.asesor_id,
        //         // nombre_unico: `${value.nombre}-${value.id}`,
        //         contacto_inicio: value.fecha_primera_interaccion,
        //         ultimo_contacto: value.fecha_ultima_interaccion,
        //         fecha_ultimo_mensaje_masivo_enviado: value.fecha_ultimo_mensaje_masivo_enviado,
        //         cantidad_interacciones: dataMsg.length,
        //         cliente: es_cliente
        //         // cliente: value.es_cliente == 0 ? false : true
        //       };
        //       // console.log(sesion)
        //       getRecordByField(sesion.nombre_unico, async (err,resultRecord) => {
        //         if(err){
        //           // console.log(err)
        //           console.log('error')
        //         }
        //         if(resultRecord) {
        //           console.log('acutalizando record')
        //           console.log(resultRecord)
        //           await updateRecord(resultRecord.id, sesion)
        //           console.log('sesion actualizada')
        //           // parentPort.postMessage('done');
        //         } else {
        //           console.log('crear nuevo record')
        //           try {
        //             await createRecord(sesion)
        //           } catch (error) {
        //             console.log('error!')
        //             console.log(error)
        //           }
        //         }
        //       })  
        //     }
        //   });
        // })
        // parentPort.postMessage('error on creating record');
        // parentPort.postMessage('done');




        // for (let contact of data) {
        //    console.log('running for user', contact.id)
        //    Sesion.getMsgById(contact.id, async (err, dataMsg) => {
        //     if (err) {
        //       console.log(err)
        //     } else {
        //       const sesion = {
        //         nombre_unico: `${contact.nombre}-${contact.id}`,
        //         contacto_inicio: contact.fecha_primera_interaccion,
        //         ultimo_contacto: contact.fecha_ultima_interaccion,
        //         ultimo_mensaje_masivo_enviado: 'lorem ipsum',
        //         cantidad_interacciones: dataMsg.length,
        //         cliente: false
        //       };
        //       try {
        //         // const result = await createRecord(sesion);
        //         const result = await getRecordByField(sesion.nombre_unico);
        //         console.log(result)
        //       } catch (error) {
        //         console.log(error)
        //       }
        //     }
        //   });
        // }

      }
    });
})();



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
