const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
var morgan = require('morgan')
const app = express();

var http = require("http");


// var corsOptions = {
//   origin: "http://localhost:8081"
// };


// app.use(cors(corsOptions));


app.use(cors())

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
    // // runs the job on Start
    {
      name : 'metrics', //create metrics for the database in airtable
      // interval : '20s' //run the script after 200 seconds from the start
      interval: 'on the last day of the month'
    },
    {
      name : 'sample', //send msg between 30 and 60 days
      interval : 'at 16:00 pm' //run the script after 200 seconds from the start
    },
    {
      name : 'sampletwo', // create sesion info for clients in airtable
      interval : '30m' //run the script after 30 seconds from the start
    }
  ]
})
bree.start()

setInterval(function() {
  http.get("http://estudiar-hoy-api.herokuapp.com/");
}, 300000 * 6); // every 5 minutes (300000)


// set port, listen for requests
const PORT = process.env.PORT || 8080;
var date = new Date();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`date is  ${date}.`);
});
