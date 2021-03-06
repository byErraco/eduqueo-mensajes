module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  router.post("/mensaje", tutorials.saveMsg);
  router.post("/agregar-contacto", tutorials.agregarContacto);
  router.post("/airtable-mensajes", tutorials.airtableMensajes);
  router.post("/agregar-filtro", tutorials.addFilter);
  router.post("/actualizar-mensaje", tutorials.updateMensajeAutomatico);
  
  app.use('/api/hormigas', router);
};
