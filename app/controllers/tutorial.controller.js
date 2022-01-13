const Sesion = require("../models/sesion.model.js");

const Airtable = require('airtable');

const base = new Airtable({ apiKey: 'keyaSZubvuicnMRyO' }).base(
  // 'appqvc1jKHBIRRbSy'
  'app5VPWEzWCR4bUbe'
);
const tabletest = base('PricelistNob2021');

const tablaSesiones = base('Sesiones');


//airtable
const minifyRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};
const getRecords = async () => {
  const records = await tabletest
    // .select({ maxRecords: 3, view: 'All projects' })
    .select({ maxRecords: 3 })
    .firstPage();
    // console.log(minifyRecord(records))
  return records
  // console.log(records);
};

//tablaSesiones crear
const createRecord = async (fields) => {
  const createdRecord = await tablaSesiones.create(fields);
  // console.log(minifyRecord(createdRecord));
  return minifyRecord(createdRecord)
};



// Crear y guardar nueva sesion
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Tutorial
  const sesion = new Sesion({
    contacto_inicio: req.body.contacto_inicio,
    ultimo_contacto: req.body.ultimo_contacto,
    ultimo_mensaje_masivo_enviado: req.body.ultimo_mensaje_masivo_enviado,
    cantidad_interacciones: req.body.cantidad_interacciones,
    cliente: req.body.cliente || false
  });

  // Save Tutorial in the database
  Sesion.create(sesion, async (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the session."
      });
    else {
      try {
        const result = await createRecord(sesion);
        res.json({
          message: 'ok',
          dbRecord: data,
          airtableRecord: result
        });
      } catch (error) {
        console.log(error)
      }
      
    }
  });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = async (req, res) => {
  const title = req.query.title;

  try {
    const result = await getRecords();
    res.send('ok')
  } catch (error) {
    console.log(error)
  }
  // Tutorial.getAll(title, (err, data) => {
  //   if (err)
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving tutorials."
  //     });
  //   else res.send(data);
  // });
};

// Find a single Tutorial by Id
exports.findOne = (req, res) => {
  Sesion.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Tutorial with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Tutorial with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// find all published Tutorials
exports.findAllPublished = (req, res) => {
  Sesion.getAllPublished((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    else res.send(data);
  });
};

// Update a Tutorial identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Sesion.updateById(
    req.params.id,
    new Sesion(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Tutorial with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Tutorial with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  Sesion.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Tutorial with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Tutorial with id " + req.params.id
        });
      }
    } else res.send({ message: `Tutorial was deleted successfully!` });
  });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Sesion.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    else res.send({ message: `All Tutorials were deleted successfully!` });
  });
};
