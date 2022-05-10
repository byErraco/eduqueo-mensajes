const sql = require("./db.js");

// constructor
const Sesion = function(sesion) {
  this.fecha_primera_interaccion = sesion.fecha_primera_interaccion;
  this.fecha_ultima_interaccion = sesion.fecha_ultima_interaccion;
  this.fecha_ultimo_mensaje_masivo_enviado = sesion.fecha_ultimo_mensaje_masivo_enviado;
  this.nombre = sesion.nombre;
  this.es_cliente = sesion.es_cliente;
  this.cantidad_interacciones = sesion.cantidad_interacciones;
  this.asesor_id = sesion.asesor_id;
};


Sesion.findById = (id, result) => {
  sql.query(`SELECT * FROM tutorials WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found tutorial: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Sesion.create = (newSession, result) => {
  sql.query("INSERT INTO sesiones SET ?", newSession, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created sesion: ", { id: res.insertId, ...newSession });
    result(null, { id: res.insertId, ...newSession });
  });
};

Sesion.getMsgById = (id, result) => {
  sql.query(`SELECT * FROM mensajes WHERE id_contacto = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found msgs: ", res.length);
      result(null, res);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Sesion.getAll = (result) => {
  let query = "SELECT * FROM mensajes";
  // let query = "SELECT * FROM tutorials";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // console.log("tutorials: ", res);
    result(null, res);
  });
};
//mudar a otro modelo mensajes
Sesion.getAllMensajes = (result) => {
  let query = "SELECT * FROM mensajes";
  // let query = "SELECT * FROM tutorials";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // console.log("tutorials: ", res);
    result(null, res);
  });
};
Sesion.getAllMensajesByMonth = (result) => {
  let query = "SELECT * FROM mensajes WHERE MONTH(fecha)=MONTH(now()) and YEAR(fecha)=YEAR(now())";
  // let query = "SELECT * FROM tutorials";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // console.log("tutorials: ", res);
    result(null, res);
  });
};



//mudar a otro modelo contactos
Sesion.getAllContactos = (result) => {
  let query = "SELECT * FROM contactos";
  // let query = "SELECT * FROM tutorials";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // console.log("tutorials: ", res);
    result(null, res);
  });
};


Sesion.getContactByName = (name, result) => {
  sql.query(`SELECT * FROM contactos WHERE nombre = "${name}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found msgs: ", res.length);
      result(null, res);
      return;
    } else {
    // not found contact with the id
    result(null, 'no existe');
    return;
    }
  });
};

Sesion.createContact = (newContact, result) => {
  sql.query("INSERT INTO contactos SET ?", newContact, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // console.log("created contact: ", { id: res.insertId, ...newContact });
    result(null, { id: res.insertId, ...newContact });
  });
};
Sesion.createMensaje = (newMsg, result) => {
  sql.query("INSERT INTO mensajes SET ?", newMsg, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created msg: ", { id: res.insertId, ...newMsg });
    result(null, { id: res.insertId, ...newMsg });
  });
};


Sesion.updateContactInteraction = (id, contact, result) => {
  sql.query(
    "UPDATE contactos SET fecha_ultima_interaccion = ?, cantidad_interacciones = cantidad_interacciones + ?, es_cliente = ? WHERE id = ?",
    [contact.fecha_ultima_interaccion, contact.cantidad_interacciones, contact.es_cliente, id],
    (err, resData) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (resData.affectedRows == 0) {
        // not found contact with the id
        result({ kind: "not_found" }, null);
        return;
      }
      // console.log(resData)
      // console.log("updated contact: ", { id: id, ...contact,resData });
      result(null, { id:id, ...contact });
    }
  );
};
Sesion.updateContactInteractionByName = (name, date,type, result) => {
  sql.query(
    `UPDATE contactos SET fecha_ultimo_mensaje_masivo_enviado = ?, cantidad_interacciones = cantidad_interacciones + ?, ${type} = ? WHERE nombre = ?`,
    // `UPDATE contactos SET fecha_ultima_interaccion = ?,fecha_ultimo_mensaje_masivo_enviado = ?, cantidad_interacciones = cantidad_interacciones + ? WHERE nombre = ?`,
    [date, 1,1,name],
    // [date,date, 1,name],
    (err, resData) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (resData.affectedRows == 0) {
        // not found contact with the id
        result({ kind: "not_found" }, null);
        return;
      }
      // console.log(resData)
      // console.log("updated contact: ", { id: id, ...contact,resData });
      // result(null, { id:id, ...contact });
      result(null, { resData });
    }
  );
};
Sesion.updateContactInteractionByNameNoType = (name, date, result) => {
  sql.query(
    `UPDATE contactos SET fecha_ultimo_mensaje_masivo_enviado = ?, cantidad_interacciones = cantidad_interacciones + ? WHERE nombre = ?`,
    // `UPDATE contactos SET fecha_ultima_interaccion = ?,fecha_ultimo_mensaje_masivo_enviado = ?, cantidad_interacciones = cantidad_interacciones + ? WHERE nombre = ?`,
    [date, 1,1,name],
    // [date,date, 1,name],
    (err, resData) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (resData.affectedRows == 0) {
        // not found contact with the id
        result({ kind: "not_found" }, null);
        return;
      }
      // console.log(resData)
      // console.log("updated contact: ", { id: id, ...contact,resData });
      // result(null, { id:id, ...contact });
      result(null, { resData });
    }
  );
};


Sesion.updateFilterById = (id, nombre, result) => {
  sql.query(
    "UPDATE filtros SET nombre = ? WHERE id = ?",
    [nombre, id],
    (err, resData) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (resData.affectedRows == 0) {
        // not found contact with the id
        result({ kind: "not_found" }, null);
        return;
      }
      // console.log(resData)
      // console.log("updated contact: ", { id: id, ...contact,resData });
      result(null, { id:id, ...resData });
    }
  );
};


Sesion.findFilterById = (id, result) => {
  sql.query(`SELECT * FROM filtros WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found filter: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Sesion.createFiltro = (filtro, result) => {
  sql.query("INSERT INTO filtros SET ?", filtro, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created msg: ", { id: res.insertId, ...filtro });
    result(null, { id: res.insertId, ...filtro });
  });
};

Sesion.getAllFiltros = (result) => {
  let query = "SELECT * FROM filtros";
  // let query = "SELECT * FROM tutorials";
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    // console.log("tutorials: ", res);
    result(null, res);
  });
};

module.exports = Sesion;
