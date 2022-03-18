
const axios = require("axios");
const Sesion = require("../app/models/sesion.model");
const { parentPort } = require('worker_threads');

const mostFrequent = (array) => {
  let map = array.map((a) => array.filter((b) => a === b).length);
  return array[map.indexOf(Math.max.apply(null, map))];
}
//airtable
const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyaSZubvuicnMRyO' }).base(
  // 'appqvc1jKHBIRRbSy'
  'app5VPWEzWCR4bUbe'
);
const tablaSesiones = base('Metricas');
const minifyRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};
const createRecord = async (fields) => {
  const createdRecord = await tablaSesiones.create(fields);
  // console.log(minifyRecord(createdRecord));
  return minifyRecord(createdRecord)
};

(async () => {
    console.log('Getting all msgs')
    var phoneOne = []
    var phoneTwo = []
    var msgHours = []
    var msgChar = ''

    Sesion.getAllMensajes(async (err, data) => {
      if (err) {
        console.log(err)
      } else {
        for (let msgData of data) {
          if(msgData.id_celular == 1) phoneOne.push(msgData)
          if(msgData.id_celular == 2) phoneTwo.push(msgData)
          msgHours.push(msgData.fecha.getHours());
          msgChar+= msgData.mensaje;
        }
        const mostFrequentHour = mostFrequent(msgHours);
        var metricObj = {
          hora_mas_frecuente: '',
          total_caracteres: '',
          cantidad_msg_telefono_1: '',
          cantidad_msg_telefono_2: '',
          total_msg: '',
        }
        if(mostFrequentHour < 11) {
          console.log(`Most frequent hour is ${mostFrequentHour} A.M`);
          metricObj.hora_mas_frecuente = `${mostFrequentHour} A.M`
        }
        if(mostFrequentHour > 12) {
          console.log(`Most frequent hour is ${mostFrequentHour} P.M`);
          metricObj.hora_mas_frecuente = `${mostFrequentHour} P.M`
        }
        console.log('Amount of characters:', msgChar.length)
        metricObj.total_caracteres = msgChar.length
        console.log('Amount messages phone 1:', phoneOne.length)
        metricObj.cantidad_msg_telefono_1 = phoneOne.length
        console.log('Amount messages phone 2:', phoneTwo.length)
        metricObj.cantidad_msg_telefono_2 = phoneTwo.length
        console.log('Total messages:', phoneOne.length+phoneTwo.length)
        metricObj.total_msg = phoneOne.length+phoneTwo.length

       console.log(metricObj)
       try {
        await createRecord(metricObj)
        parentPort.postMessage('done');
       
        return
       } catch (error) {
         console.log(error)
         parentPort.postMessage('error');
         return 
       }
      }
    });
})();

