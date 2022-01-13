const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
var morgan = require('morgan')
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
app.use(morgan('tiny'));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to erraco application." });
});

require("./app/routes/tutorial.routes.js")(app);





const Bree = require('bree')
const bree = new Bree({
  jobs : [
    // runs the job on Start
    {
      name : 'sample',
      interval : '20s' //run the script after 200 seconds from the start
    },
    // {
    //   name : 'sampletwo',
    //   interval : '30s' //run the script after 30 seconds from the start
    // }
  ]
})
bree.start()


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
