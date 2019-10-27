const express = require('express') 
const app = express(); 
var bodyParser = require('body-parser');
const port = 8081


// models
var models = require("./models");

// routes
var register = require('./routes/register');
var students = require('./routes/students');
var teachers = require('./routes/teachers');
var notificationmanager = require('./routes/notificationmanager');


//Sync Database
models.sequelize.sync().then(()=> {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// routes
app.use('/api/register', register);
app.use('/api/students', students);
app.use('/api/teachers', teachers);
app.use('/api/notificationmanager', notificationmanager);

// index path
app.get('/', function(req, res){
    console.log('app listening on port: '+port);
    res.send('API is working')
});

app.listen(port, function(){
    console.log('app listening on port: '+port);
});