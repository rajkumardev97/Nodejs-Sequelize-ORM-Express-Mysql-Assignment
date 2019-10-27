# Nodejs-Sequelize-ORM-Express-Mysql-Assignment
Nodejs Sequelize ORM Express Mysql Assignment

# install node dependencies

npm install

# install sequelize-cli

npm install --save-dev sequelize-cli

# create database via sequelize

sequelize db:create

# create migration for System model

sequelize-cli model:generate --name Register --attributes name:string,email:string,role:string

sequelize-cli model:generate --name Student --attributes name:string,email:string,status:boolean

sequelize-cli model:generate --name Teacher --attributes name:string,email:string 

sequelize-cli model:generate --name Association --attributes teacherEmail:string,StudentEmail:string,StudentName:string 

sequelize-cli model:generate --name NotificationManager --attributes teacherEmail:string,StudentEmail:string,Notification:string 

# to run migration

sequelize db:migrate

# Run the Server

npm start

# END Points

1) POST : http://localhost:8081/api/register

   Signature for register Student : 

   req body eg 1:  {
                 "email":"john@gmail.com",
                 "name":"john",
                 "role":"Student"
              }

   req body eg 2:  {
                 "email":"profa@gmail.com",
                 "name":"profa",
                 "role":"Teacher"
              }

    response eg: {
                  "success": "Student created successfully!!"
                 }

                 or 

                 {
                  "success": "Teacher created successfully!!"
                 }


2) POST : http://localhost:8081/api/register/association

  Signature for Students Association with Teacher: 

   req body eg :  {
                        "teacherEmail":"profb@gmail.com",
                        "students":[{"StudentEmail":"john@gmail.com","StudentName":"john"},{"StudentEmail":"bob@gmail.com","StudentName":"bob"}]
                    }

    response:   {
                    "success": "Student is Associated successfully !!"
                }


3) POST : http://localhost:8081/api/teachers/commonstudents
 
   Signature for retrieve a list of students common to a given list of teachers 
  
  req body eg : {
                    "teacherEmails":["profb@gmail.com","profx@gmail.com"]
                }

  RESPONSE: [
                {
                    "StudentEmail": "bob@gmail.com"
                },
                {
                    "StudentEmail": "john@gmail.com"
                },
                {
                    "StudentEmail": "lima@gmail.com"
                }
            ]

4) POST : http://localhost:8081/api/teachers/suspend

    Signature for suspend a specified student
    
    req body eg :   {
                        "teacherEmail":"profx@gmail.com",
                        "StudentEmail":"bob@gmail.com"
                    }

    Response:   {
                    "success": "student email : bob@gmail.com is Suspended Successfully !!"
                }

5) POST : http://localhost:8081/api/notificationmanager/retrievefornotifications

    Signature for a list of students who can receive a given notification
    
    req body eg : {
                    "teacherEmail":"profx@gmail.com",
                    "notification":"Hello Every One please complete your math chapter 2 exercise 2.1,2.2,2.3,2.4 !!",
                    "studentEmail":["john@gmail.com","bob@gmail.com","giga@gmail.com"]
                  }

    Response:    {
                    "Notification_Received_By_Valid_Student_Email": [
                        "john@gmail.com",
                        "bob@gmail.com"
                    ],
                    "Notification_Not_Received_By_Student_Email": [
                        "giga@gmail.com"
                    ]
                }


# Extra Endpoints

6) GET: http://localhost:8081/api/teachers/all
  
  -> get all teachers in our system

7) GET: http://localhost:8081/api/students/all
  
  -> get all students in our system

8) DELETE: http://localhost:8081/api/register/studentdelete/john@gmail.com
  
  -> delete students by its email in our system

9) GET: http://localhost:8081/api/notificationmanager/all
  
  -> get all notifications in our system

10) GET: http://localhost:8081/api/students/mynotification/john@gmail.com
  
  -> get all notifications by student email in our system

