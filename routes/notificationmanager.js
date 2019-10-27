var express = require('express');
var Student = require('../models').Student;
var Teacher = require('../models').Teacher;
var Association = require('../models').Association;
var NotificationManager = require('../models').NotificationManager;
var router = express.Router();

const Sequelize = require('sequelize').Sequelize;
const Op = Sequelize.Op;


router.get('/all', function(req, res){
    console.log('getting all notification data');
    NotificationManager.findAll().then(notification => {
        res.json(notification);
    });
});

router.post('/retrievefornotifications', (req, res)=>{

    let teacherEmail=req.body.teacherEmail
    let Notification=req.body.notification
    let studentEmail=req.body.studentEmail

    let isteacherEmailValid=true
    
    async function asyncRetrieveForNotificCall() {

         //here we check teacher email is valid or not
      await Teacher.findOne({ where:{
        email:teacherEmail
        }}).then((teacher)=>{

            if(teacher){ //its mean teacher email is valid
                isteacherEmailValid=true  
                console.log("Teacher Email : "+ teacherEmail+" is valid !!")

            }else{  //its mean teacher email is invalid

                console.log("Teacher Email : "+ teacherEmail+" is invalid !!")
                isteacherEmailValid=false  
               return res.status(400).json({error:"Teacher Email :"+ teacherEmail+" is invalid !!"});
            
            } 
        }).catch(error=>{ 
                console.log("error is : "+error)
                isteacherEmailValid=false  
                return res.status(400).json({error:"Something went wrong !!"})
            })


            if(isteacherEmailValid){

                let finalnotificationData={
                    "Notification_Received_By_Valid_Student_Email": [],
                    "Notification_Not_Received_By_Student_Email":[]
                }
               
                for(var i=0;i<studentEmail.length;i++){ 
                   
                 //  console.log("email at index :  "+i+" is : "+studentEmail[i])
                     await Student.findOne({ where:{
                        email:studentEmail[i]
                     }}).then(async student=>{
                        if(student&&student.status===true){ //valid student email id with status true
                             
                            var notifiData={
                                teacherEmail:teacherEmail,
                                StudentEmail:studentEmail[i],
                                Notification:Notification
                            }
 
                            await  NotificationManager.create(notifiData).then(async notification=>{
                              
                                if(notification){
                                        //here we push valid email that will receive notification
                                        await finalnotificationData.Notification_Received_By_Valid_Student_Email.push(studentEmail[i])
                                            
                                }
                               
                            }).catch(error=>{ 
                                console.log("error is : "+error) 
                                return res.status(400).json({error:"Something went wrong !!"})
                            })

                         
                    }else{ //invalid student email id

                          await finalnotificationData.Notification_Not_Received_By_Student_Email.push(studentEmail[i])

                    }
                        
                     }).catch(error=>{ 
                        console.log("error is : "+error) 
                        return res.status(400).json({error:"Something went wrong !!"})
                    })

                }
                   
                res.json(finalnotificationData)


            }



    }

    asyncRetrieveForNotificCall()


})

module.exports = router;