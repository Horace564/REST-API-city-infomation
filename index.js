var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb/bigcities')
 .then(() =>{
    console.log("Connected to the database");
 })
 .catch(err =>{
    console.log("Connection error: " + err);
 })

//monitor the status of the connection
mongoose.connection.on('disconnected', function() {
    console.log('Lost connection to the database');
    process.exit(1);
})

var mySchema = new mongoose.Schema({
    '_id': Number,
    'Name': String,
    'ASCII Name': String,
    'ISO Alpha-2': String,
    'ISO Name EN': String,
    Population: Number,
    Timezone: String,
    'Modification date': String,
    Coordinates: String
});

var bigcities = mongoose.model('bigcities', mySchema, 'cities');

var taskBHandler = require('./taskB');
var taskCHandler = require('./taskC');
var taskDHandler = require('./taskD');
var taskEHandler = require('./taskE');

app.use(function(req, res, next){
    req.bigcities = bigcities; 
    next();
  })

app.use('/cities/v1/all',taskBHandler);
app.use('/cities/v1/alpha',taskCHandler);
app.use('/cities/v1/region',taskDHandler),
app.use('/cities/v1',taskEHandler);




app.all('*', (req, res) =>{
    const errmsg = `Cannot ${req.method} ${req.originalUrl}`
    res.status(400).send(JSON.stringify({'error': errmsg}))
})









// error handler
app.use(function(err, req, res, next) {
  console.log("outter err")
  res.status(err.status || 500);
  res.json({'error': err.message});
});

app.listen(3000, () => {
  console.log('Weather app listening on port 8000!')
});
