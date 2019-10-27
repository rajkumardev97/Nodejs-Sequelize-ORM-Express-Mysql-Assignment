var express = require('express');
var Student = require('../models').Student;
var router = express.Router();
  
var NotificationManager = require('../models').NotificationManager;

router.get('/all', function(req, res){
    console.log('getting all students data');
    Student.findAll().then(students => {
        res.json(students);
    });
});

router.get('/mynotification/:studentemail', function(req, res){
    console.log('getting my all notification by email');
    let studentEmail=req.params.studentemail
    NotificationManager.findAll({ where:{
        StudentEmail:studentEmail
     }}).then(mynotifications => {
        res.json(mynotifications);
    });
});

 
module.exports = router;