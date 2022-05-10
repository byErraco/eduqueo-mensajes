module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  router.post("/mensaje", tutorials.saveMsg);
  router.post("/airtable-mensajes", tutorials.airtableMensajes);
  router.post("/agregar-filtro", tutorials.addFilter);
  
  app.use('/api/hormigas', router);
};
