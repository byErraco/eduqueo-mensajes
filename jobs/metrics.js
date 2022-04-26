
const axios = require("axios");
const Sesion = require("../app/models/sesion.model");
const { parentPort } = require('worker_threads');

const mostFrequent = (array) => {
  let map = array.map((a) => array.filter((b) => a === b).length);
  return array[map.indexOf(Math.max.apply(null, map))];
}
//airtable
const Airtable = require('airtable');
//prod
const base = new Airtable({ apiKey: 'keychMsGE74MU7aPW' }).base(
  'appLozC8HlQpY5OGi'
);
//dev
// const base = new Airtable({ apiKey: 'keyaSZubvuicnMRyO' }).base(
//   'app5VPWEzWCR4bUbe'
// );
const tablaMetricas = base('Metrics');
// const tablaSesiones = base('Metricas');
const minifyRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};
const createRecord = async (fields) => {
  const createdRecord = await tablaMetricas.create(fields);
  // console.log(minifyRecord(createdRecord));
  return minifyRecord(createdRecord)
};

(async () => {
    console.log('Getting all msgs')
    var phoneOneArr = []
    var phoneTwoArr = []
    // var msgHours = []
    // var msgChar = ''

    Sesion.getAllMensajesByMonth(async (err, data) => {
    // Sesion.getAllMensajes(async (err, data) => {
      console.log(data.length)
      if (err) {
        console.log(err)
      } else {
        for (let msgData of data) {
          if(msgData.id_celular == 1) phoneOneArr.push(msgData)
          if(msgData.id_celular == 2) phoneTwoArr.push(msgData)
        }
        var metrics = []
        metrics.push(phoneOneArr,phoneTwoArr);

        function createMetrics(metric) {
          return new Promise((resolve, reject) => {
            var hoy = new Date()
            var telefonoData = {
              cantidad_mensajes: metric.length,
              cantidad_caracteres: 0,
              id_telefono: metric[0].id_celular,
              fecha: hoy,
              // fecha: hoy.toISOString(),
            }
            for(let msgData of metric) {
              telefonoData.cantidad_caracteres+= msgData.mensaje.length
            }
            resolve(telefonoData)
          });
        }
        let promiseArr = [];

        metrics.forEach(metric => promiseArr.push(createMetrics(metric)));
        Promise.all(promiseArr)
          .then(async(res) => {
            console.log('Metrics calculated and sended')
            console.log(res)
            try {
              for (let metric of res) {
                await createRecord(metric)
              }
            } catch (error) {
              console.log(error)
            }
          })
          .catch(err => console.log(err))
          .finally(() => parentPort.postMessage('done'))
      }
    });
})();







        // for (let msgData of data) {
          // if(msgData.id_celular == 1) phoneOne.push(msgData)
          // if(msgData.id_celular == 2) phoneTwo.push(msgData)
          // msgHours.push(msgData.fecha.getHours());
          // msgChar+= msgData.mensaje;
        // }
      //   const mostFrequentHour = mostFrequent(msgHours);
      //   var metricObj = {
      //     hora_mas_frecuente: '',
      //     total_caracteres: '',
      //     cantidad_msg_telefono_1: '',
      //     cantidad_msg_telefono_2: '',
      //     total_msg: '',
      //   }
      //   if(mostFrequentHour < 11) {
      //     console.log(`Most frequent hour is ${mostFrequentHour} A.M`);
      //     metricObj.hora_mas_frecuente = `${mostFrequentHour} A.M`
      //   }
      //   if(mostFrequentHour > 12) {
      //     console.log(`Most frequent hour is ${mostFrequentHour} P.M`);
      //     metricObj.hora_mas_frecuente = `${mostFrequentHour} P.M`
      //   }
      //   console.log('Amount of characters:', msgChar.length)
      //   metricObj.total_caracteres = msgChar.length
      //   console.log('Amount messages phone 1:', phoneOne.length)
      //   metricObj.cantidad_msg_telefono_1 = phoneOne.length
      //   console.log('Amount messages phone 2:', phoneTwo.length)
      //   metricObj.cantidad_msg_telefono_2 = phoneTwo.length
      //   console.log('Total messages:', phoneOne.length+phoneTwo.length)
      //   metricObj.total_msg = phoneOne.length+phoneTwo.length

      //  console.log(metricObj)
      //  try {
      //   await createRecord(metricObj)
      //   parentPort.postMessage('done');
       
      //   return
      //  } catch (error) {
      //    console.log(error)
      //    parentPort.postMessage('error');
      //    return 
      //  }

