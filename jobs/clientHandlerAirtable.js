
const axios = require("axios");
const Sesion = require("../app/models/sesion.model");
const Airtable = require('airtable');
const { parentPort } = require('worker_threads');
//prod
const base = new Airtable({ apiKey: 'keyaes1DV3xwLUi0b' }).base(
  'appLozC8HlQpY5OGi'
);
//dev
// const base = new Airtable({ apiKey: 'keyaSZubvuicnMRyO' }).base(
//   'app5VPWEzWCR4bUbe'
// );
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
  // console.log(minifyRecord(updatedRecord));
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
                resolve()
              } else {
                var es_cliente 
                // console.log(obj)
                console.log('actualizando sesiones en airtable')
                if(obj.es_cliente === 1) {
                  es_cliente = true
                } else {
                  if(obj.nombre.startsWith("AA")) {
                    es_cliente = true
                  } else {
                    es_cliente = false
                  }
                }

                var sesion 
                if( obj.fecha_ultimo_mensaje_masivo_enviado == null) {
                  sesion = {
                    nombre_unico: `${obj.nombre}`,
                    asesor_id: obj.asesor_id,
                    // nombre_unico: `${value.nombre}-${value.id}`,
                    contacto_inicio: obj.fecha_primera_interaccion,
                    ultimo_mensaje_recibido: obj.fecha_ultima_interaccion,
                    // ultimo_contacto: obj.fecha_ultima_interaccion,
                    // fecha_ultimo_mensaje_masivo_enviado: obj.fecha_ultimo_mensaje_masivo_enviado,
                    cantidad_interacciones: dataMsg.length,
                    cliente: es_cliente
                    // cliente: obj.es_cliente == 0 ? false : true
                  };
                } else {
                  sesion = {
                    nombre_unico: `${obj.nombre}`,
                    asesor_id: obj.asesor_id,
                    // nombre_unico: `${value.nombre}-${value.id}`,
                    contacto_inicio: obj.fecha_primera_interaccion,
                    ultimo_mensaje_recibido: obj.fecha_ultima_interaccion,
                    // ultimo_contacto: obj.fecha_ultima_interaccion,
                    fecha_ultimo_mensaje_masivo_enviado: obj.fecha_ultimo_mensaje_masivo_enviado,
                    cantidad_interacciones: dataMsg.length,
                    cliente: es_cliente
                    // cliente: obj.es_cliente == 0 ? false : true
                  };
                  // console.log(sesion)
                }
                
  

                getRecordByField(sesion.nombre_unico, async (err,resultRecord) => {
                  if(err){
                    // console.log(err)
                    console.log('error')
                  }
                  if(resultRecord) {
                      try {
                        await updateRecord(resultRecord.id, sesion)
                      resolve()
                      } catch (error) {
                        console.log(error)
                        
                      }
                  } else {
                      try {
                        await createRecord(sesion)
                        resolve()
                      } catch (error) {
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

      }
    });
})();


