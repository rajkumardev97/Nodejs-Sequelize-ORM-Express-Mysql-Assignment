var express = require('express');
var Student = require('../models').Student;
var Teacher = require('../models').Teacher;
var Association = require('../models').Association;
var router = express.Router();

const Sequelize = require('sequelize').Sequelize;
const Op = Sequelize.Op;
  
router.get('/all', function(req, res){
    console.log('getting all teachers data');
    Teacher.findAll().then(teachers => {
        res.json(teachers);
    });
});



router.post('/commonstudents', (req, res)=>{

    console.log('getting all common students data via array of teacher email');

    let teacherEmails=req.body.teacherEmails //["profa@gmail.com","profx@gmail.com"]

    let isteacherEmailValid=true
    
    async function asyncCommonStudentsCall() {

        for(var i=0;i<teacherEmails.length;i++){
                //here we check teacher email is valid or not
                await Teacher.findOne({ where:{
                    email:teacherEmails[i]
                }}).then((teacher)=>{

                    if(teacher){ //its mean teacher email is valid
                        isteacherEmailValid=true 
                        console.log("Teacher Email : "+ teacherEmails[i]+" is valid !!")

                    }else{  //its mean teacher email is invalid

                        console.log("Teacher Email : "+ teacherEmails[i]+" is invalid !!")
                        isteacherEmailValid=false 
                        res.status(400).json({error:"Teacher Email :"+ teacherEmails[i]+" is invalid !!"})
                    
                    } 
                }).catch(error=>{ 
                        console.log("error is : "+error)
                        isteacherEmailValid=false 
                        res.status(400).json({error:"Something went wrong !!"})
                    })
        }
       
        if(isteacherEmailValid){
            console.log("all teacher email is valid !!")

            await Association.findAll({ 
                where: {
                    teacherEmail: {
                      [Op.in]: teacherEmails
                    }
                  },
                  attributes: ['StudentEmail'], //get only StudentEmail
                  group: ['StudentEmail'] //grouping by StudentEmail so we get unique StudentEmail
              }).then((associationData)=>{

                res.json(associationData) 

            })
            
        }

    }

    asyncCommonStudentsCall()

    
})
 
router.post('/suspend', (req, res)=>{

//console.log("here we suspend the student by its email !")
 
let teacherEmail=req.body.teacherEmail
let StudentEmail=req.body.StudentEmail

let isteacherEmailValid=true 
let isstudentEmailValid=true 

async function asyncSuspendCall() {


      //here we check teacher email is valid or not
      await Teacher.findOne({ where:{
        email:teacherEmail
        }}).then((teacher)=>{

            if(teacher){ //its mean teacher email is valid
                isteacherEmailValid=true 
                isstudentEmailValid=true 
                console.log("Teacher Email : "+ teacherEmail+" is valid !!")

            }else{  //its mean teacher email is invalid

                console.log("Teacher Email : "+ teacherEmail+" is invalid !!")
                isteacherEmailValid=false 
                isstudentEmailValid=false
               return res.status(400).json({error:"Teacher Email :"+ teacherEmail+" is invalid !!"});
            
            } 
        }).catch(error=>{ 
                console.log("error is : "+error)
                isteacherEmailValid=false 
                isstudentEmailValid=false
                return res.status(400).json({error:"Something went wrong !!"})
            })

            if(isteacherEmailValid&&isstudentEmailValid){
                  //here we check student email is valid or not
            await Student.findOne({ where:{
                email:StudentEmail
                }}).then((student)=>{

                    if(student){ //its mean student email is valid
                        isstudentEmailValid=true 
                        isteacherEmailValid=true
                        console.log("Student Email : "+ StudentEmail+" is valid !!")

                    }else{  //its mean student email is invalid

                        console.log("Student Email : "+ StudentEmail+" is invalid !!")
                        isstudentEmailValid=false 
                        isteacherEmailValid=false
                        return  res.status(400).json({error:"Student Email :"+ StudentEmail+" is invalid !!"})
                    
                    } 
                }).catch(error=>{ 
                        console.log("error is : "+error)
                        isstudentEmailValid=false 
                        isteacherEmailValid=false
                        return res.status(400).json({error:"Something went wrong !!"})
                    })

            }

            if(isteacherEmailValid&&isstudentEmailValid){

                await Association.findOne({  
                    where:{
                        teacherEmail:teacherEmail,
                        StudentEmail:StudentEmail,
                    }
                }).then((associationData)=>{
        
                    if(associationData){
        
                        console.log("here we suspend student !!")

                        Student.findOne({ where: { email: StudentEmail }}).then((student)=>{
                        
                           // res.json(student)
                            if(student.status===false){ //check if status is false then student email id is already suspended
                                console.log("student email id is already suspended  !!")
        
                                return  res.status(400).json({error:"student email id is already suspended !!"})
                
                            }else{ //here we suspend the student email id 
                                Student.update(
                                    { status: false },
                                    { where: { email: StudentEmail }  
                                   }).then((student)=>{
                                       console.log("student email : "+StudentEmail+ " is Suspended Successfully !!")
                                       res.json({success:"student email : "+StudentEmail+ " is Suspended Successfully !!"})
                                   }).catch(error=>{
                                    console.log("error is : "+error) 
                                    return res.status(400).json({error:"Something went wrong !!"})
                
                                   })

                            }
                        })

                        
        
                    }else{
        
                        console.log("student is not registered with requested teacher email ID  !!")
        
                        return  res.status(400).json({error:"student is not registered with requested teacher email ID  !!"})
        
                    }
        
        
                }).catch(error=>{

                    console.log("error is : "+error) 
                    return res.status(400).json({error:"Something went wrong !!"})

                })


            }


}

asyncSuspendCall()


})




module.exports = router;