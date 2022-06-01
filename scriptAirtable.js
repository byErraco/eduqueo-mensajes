//scripting
let table = base.getTable("Sesiones");
let query = await table.selectRecordsAsync({
    fields: ["nombre_unico","asesor_id","para_enviar","blacklist","cliente","texto"]
});
var clientesArr = [];
var enviarArr = [];
for (let record of query.records) {
    const clienteData = {
        clienteNombre:record.getCellValueAsString("nombre_unico"),
        asesorId:record.getCellValueAsString("asesor_id"),
        paraEnviar:record.getCellValueAsString("para_enviar"),
        esCliente:record.getCellValueAsString("cliente"),
        enBlacklist:record.getCellValueAsString("blacklist"),
        texto:record.getCellValueAsString("texto"),
        rowId: record.id,
    }
    clientesArr.push(clienteData)
}
  let isError = false;
  for (let index of clientesArr) {
    if(index.enBlacklist !== "checked") {
      if(index.esCliente !== "checked") {
        if(index.paraEnviar === "checked") {
          enviarArr.push(index)
          if (index.texto === "") {
              isError = true;
          }
        } 
      } 
    }
     
  }

if(isError === true) {
  console.error('Error, existen columnas "texto" sin valor ')
} else {
    // let mensaje = await input.textAsync('Escribe el mensaje a enviar');
  // output.text(`El mensaje a enviar es:`);
  // output.text(mensaje);
  if(enviarArr.length === 0) {
    console.error('No hay contactos disponibles para enviar')
  } else {
    let body = {
            "arr": enviarArr,
            // "mensaje": mensaje,
        }


    let response = await remoteFetchAsync('https://eduqueo-tasker-node-api.herokuapp.com/api/hormigas/airtable-mensajes', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }, 
    });
    if(response) {
      output.markdown('# Contactos enviados a tasker!');
      for (let index of enviarArr) {
          let row = index.rowId;
          await table.updateRecordAsync(row, {
          "para_enviar" : false,
          })
        }
    } 

  }
}



//acutalizar filtros api
let table = base.getTable("Filtros");
let query = await table.selectRecordsAsync({
    fields: ["id","nombre"]
});
var filtrosArr = [];

for (let record of query.records) {
    const filtrosData = {
        id:record.getCellValueAsString("id"),
        nombre:record.getCellValueAsString("nombre"),
    }
    filtrosArr.push(filtrosData)
}

let body = {
        "filtros": filtrosArr,
    }

let response = await remoteFetchAsync('https://eduqueo-tasker-node-api.herokuapp.com/api/hormigas/agregar-filtro', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }, 
});

console.log('Filtros guardados exitosamente')

  



  

//actualizar mensaje masivo
let table = base.getTable("Mensaje_30_60");
let query = await table.selectRecordsAsync({
    fields: ["Mensaje"]
});
var mensajeArr = [];
for (let record of query.records) {
    const mensajeData = {
        mensaje:record.getCellValueAsString("Mensaje"),
    }
    mensajeArr.push(mensajeData)
}

let body = {
        "mensaje": mensajeArr[0].mensaje,
    }

let response = await remoteFetchAsync('https://eduqueo-tasker-node-api.herokuapp.com/api/hormigas/actualizar-mensaje', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }, 
});

output.markdown('# Mensaje actualizado exitosamente!');
