let table = base.getTable("Sesiones");
// let BlackListTable = base.getTable("Black List");

let query = await table.selectRecordsAsync({
    fields: ["nombre_unico","asesor_id","para_enviar","blacklist","cliente"]
});

// let queryBl = await BlackListTable.selectRecordsAsync({
//   fields: ["nombre_unico"]
// });

// var blackListArr = [];
var clientesArr = [];
var enviarArr = [];

for (let record of query.records) {
    const clienteData = {
        clienteNombre:record.getCellValueAsString("nombre_unico"),
        asesorId:record.getCellValueAsString("asesor_id"),
        paraEnviar:record.getCellValueAsString("para_enviar"),
        esCliente:record.getCellValueAsString("cliente"),
        enBlacklist:record.getCellValueAsString("blacklist")
    }
    clientesArr.push(clienteData)
}

  for (let index of clientesArr) {
      if(index.enBlacklist !== "checked") {
        if(index.esCliente !== "checked") {
          if(index.paraEnviar === "checked") {
            enviarArr.push(index)
          } 
        } 
      } 
  }

  let mensaje = await input.textAsync('Escribe el mensaje a enviar');
  output.text(`El mensaje a enviar es:`);
  output.text(mensaje);

  if(enviarArr.length === 0) {
    console.error('No hay contactos disponibles para enviar')
  } else {
    let body = {
            "arr": enviarArr,
            "mensaje": mensaje,
        }
    console.log(body)
    let response = await remoteFetchAsync('https://estudiar-hoy-api.herokuapp.com/api/hormigas/airtable-mensajes', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }, 
    });
  }

