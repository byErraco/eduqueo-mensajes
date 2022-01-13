const sql = require("./db.js");

// constructor
const Sesion = function(sesion) {
  this.contacto_inicio = sesion.contacto_inicio;
  this.ultimo_contacto = sesion.ultimo_contacto;
  this.ultimo_mensaje_masivo_enviado = sesion.ultimo_mensaje_masivo_enviado;
  this.cantidad_interacciones = sesion.cantidad_interacciones;
  this.cliente = sesion.cliente;
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

// Sesion.getAll = (title, result) => {
//   let query = "SELECT * FROM mensajes";
//   // let query = "SELECT * FROM tutorials";

//   if (title) {
//     query += ` WHERE title LIKE '%${title}%'`;
//   }

//   sql.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("tutorials: ", res);
//     result(null, res);
//   });
// };

Sesion.getAllPublished = result => {
  sql.query("SELECT * FROM tutorials WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tutorials: ", res);
    result(null, res);
  });
};

Sesion.updateById = (id, tutorial, result) => {
  sql.query(
    "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
    [tutorial.title, tutorial.description, tutorial.published, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated tutorial: ", { id: id, ...tutorial });
      result(null, { id: id, ...tutorial });
    }
  );
};

Sesion.remove = (id, result) => {
  sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted tutorial with id: ", id);
    result(null, res);
  });
};

Sesion.removeAll = result => {
  sql.query("DELETE FROM tutorials", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} tutorials`);
    result(null, res);
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
  sql.query(`SELECT * FROM mensajes WHERE contacto_id = ${id}`, (err, res) => {
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









module.exports = Sesion;
