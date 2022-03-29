
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
          for (let value of data) {

            var Difference_In_Time = present_date.getTime() - value.fecha_ultima_interaccion.getTime();
            // console.log(Difference_In_Time)
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            // console.log(value);
            console.log(Difference_In_Days);
            // if (Difference_In_Days > 10 && Difference_In_Days < 60) {
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
                      // "name": `La Rosalia`,
                      // "message": "Hola!☀️ Me preguntaba que tal estabas y como iba todo por ahi.",
                  }
                  console.log(body)
                  console.log(apiKey)
                  console.log(deviceId)
              var requestOptions = {
                method: 'POST',
                redirect: 'follow'
                };
              console.log(body)
                fetch(`https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=${apiKey}&text=${encodeURIComponent(JSON.stringify(body))}&title=saokoooooo2&deviceId=${deviceId}`, requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error));
                  console.log('Enviando a tasker...')
        
            
            
            
            console.log('send message!')
              // parentPort.postMessage('done');
                //post to tasker
                // const article = { title: 'Axios POST Request Example' };
                // axios.post('https://reqres.in/api/articles', article)
                // .then(response => console.log(response.data));
            } else {
              console.log('dont send anything!')
            }
          }
          // parentPort.postMessage('done');
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
