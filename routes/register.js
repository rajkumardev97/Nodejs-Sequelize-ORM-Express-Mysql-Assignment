var express = require('express');
var Student = require('../models').Student;
var Teacher = require('../models').Teacher;
var Association = require('../models').Association;
var router = express.Router();
  
router.post('/', function(req, res){

    //console.log('register student or teacher');
    let name=req.body.name
    let email=req.body.email
    let role=req.body.role
    if(role==="Teacher"){
     console.log('register for Teacher');
     Teacher.findOne({
        where:{
            email:email
        }
    }).then(teacher=>{

        if(teacher){
            let error={error:"Teacher Email is already exist !!"}
             res.status(404).send(error)
        }else{
            let UserData={name:name,email:email}

            Teacher.create(UserData).then(()=>{
                res.json({success:"Teacher created successfully!!"})
            })
        }
    }).catch(error=>{
        console.log("error is "+error)
        res.status(404).send(error)
    }) 

    }else if(role==="Student"){
     console.log('register for Student');
     Student.findOne({
        where:{
            email:email
        }
    }).then(student=>{

        if(student){
            let error={error:"Student Email is already exist !!"}
             res.status(404).send(error)
        }else{
            let UserData={name:name,email:email,status:true}

            Student.create(UserData).then(()=>{
                res.json({success:"Student created successfully!!"})
            })
        }
    }).catch(error=>{
        console.log("error is "+error)
        res.status(404).send(error)
    }) 

    }else{
        res.status(400).json({error:"Role is Invalid"})
    }
     
});

router.post('/association', (req, res)=>{

    let teacherEmail=req.body.teacherEmail
    let students=req.body.students

    let FinalBulkData = []
    if(teacherEmail&&students){ 
 
        
    

    let isteacherEmailValid=true
    let isstudentEmailValid=true
    let isBulkUploadValid=true

    async function asyncAssociationCall() {
 
        for(var i=0; i<students.length;i++){
        
            let singleData={
                teacherEmail:teacherEmail,
                StudentEmail:students[i].StudentEmail,
                StudentName:students[i].StudentName
            }
           await FinalBulkData.push(singleData)

          //here we check teacher email is valid or not
          await Teacher.findOne({ where:{
            email:teacherEmail
           }}).then((teacher)=>{

            if(teacher){ //its mean teacher email is valid
                isteacherEmailValid=true
                isBulkUploadValid=true
                console.log("Teacher Email : "+ teacherEmail+" is valid !!")

            }else{  //its mean teacher email is invalid

                console.log("Teacher Email : "+ teacherEmail+" is invalid !!")
                isteacherEmailValid=false
                isBulkUploadValid=false   
                res.status(400).json({error:"Teacher Email :"+ teacherEmail+" is invalid !!"})
              
            } 
           }).catch(error=>{ 
                console.log("error is : "+error)
                isteacherEmailValid=false
                isBulkUploadValid=false 
                res.status(400).json({error:"Something went wrong !!"})
            })

              //here we check student email is valid or not
          await Student.findOne({ where:{
            email:students[i].StudentEmail
           }}).then((student)=>{

            if(student){ //its mean student email is valid
                
                isstudentEmailValid=true
                isteacherEmailValid=true
                isBulkUploadValid=true
                console.log("Student Email : "+ students[i].StudentEmail+" is valid !!")

            }else{  //its mean Student email is invalid

                console.log("Student Email : "+ students[i].StudentEmail+" is invalid !!")
                isstudentEmailValid=false
                isteacherEmailValid=false
                isBulkUploadValid=false   
                res.status(400).json({error:"Student Email :"+ students[i].StudentEmail+" is invalid !!"})
              
            } 
           }).catch(error=>{ 
                console.log("error is : "+error)
                isstudentEmailValid=false
                isteacherEmailValid=false
                isBulkUploadValid=false 
                res.status(400).json({error:"Something went wrong !!"})
            })


             
            if(isteacherEmailValid&&isstudentEmailValid){
                await Association.findOne({ //need to check teacher valid email and student email from model 
                    where:{
                        teacherEmail:teacherEmail,
                        StudentEmail:students[i].StudentEmail,
                    }
                }).then((associationData)=>{
                     
                    if(associationData){
                        isBulkUploadValid=false  
                        console.log("Student Email "+ students[i].StudentEmail+ " is already register with This Teacher Email : "+teacherEmail)
                         res.status(400).json({error:"Student Email "+ students[i].StudentEmail+ "is already register with This Teacher Email : "+teacherEmail})
                      }else{
                       console.log("Student Email "+students[i].StudentEmail+" is New for Teacher : "+teacherEmail)
                    } 
                }).catch(error=>{ 
                    console.log("error is : "+error)
                  res.status(400).json({error:"Something went wrong !!"})
                })
            } 
        }
    
        if(isBulkUploadValid&&isteacherEmailValid){

            console.log("isBulkUploadValid is : "+isBulkUploadValid)
     
                Association.bulkCreate(FinalBulkData).then(()=>{
                    console.log("student is registered with Teacher successfully !!")
                    res.json({success:"Student is Associated successfully !!"})
                  }).catch(error=>{
                      console.log("error is : "+error)
                      res.status(400).json({error:error})
           
                  }) 
        }
      }
      
      asyncAssociationCall();

  
   
    }else{
        res.json(400).error({"error":"please provide teacher email with students list !!"})
    }
})


router.delete('/studentdelete/:studentemail', (req, res)=>{

    let StudentEmail=req.params.studentemail 

    Student.findOne({ where: { email: StudentEmail }}).then((student)=>{
                        if(student){
                            console.log("Student Email is valid")
                            Student.destroy({
                                where: {
                                email: StudentEmail //this will be your id that you want to delete
                                }
                            }).then(()=>{
                                console.log("Student is deleted successfully !!")
                                return res.json({success:"Student is deleted successfully !!"})
                            }).catch(error=>{
                                console.log("error is : "+error) 
                                return res.status(400).json({error:"Something went wrong !!"})
                        
                            })
                        }else{
                            console.log("Student Email is Invalid")
                          
                            return res.status(400).json({error:"Student Email is Invalid !!"})
                    
                        }
    }).catch(error=>{
        console.log("error is : "+error) 
        return res.status(400).json({error:"Something went wrong !!"})

    })

  
})


module.exports = router;