require("dotenv").config();
const express=require("express");
const mongoose =require("mongoose");
const mongodb="mongodb://0.0.0.0:27017/TinyMiraclesDb";
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const Event=require("./schemas/events");
const {User,UserSchema} = require('./schemas/user');


const app=express();

// basic middlewares !! 
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// Connecting with the database !
mongoose.set("strictQuery", false);
mongoose.connect(mongodb,(err)=>{
    if(err){
        console.log("Unsuccess !!"+err);
    }
    else{
        console.log("MongoDb is connected !!")
    }
})


// Step2 : create schemas !!
// Step 3 : create routes for data collection 
// Step 4 : create authentication facility 
// Step 5 : integrate authentication with these routes !! 


// Handling the cors error 
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions));

// authentication : 
function authorize(req,res,next){
    console.log("User Authorized !! ");
    next();
}


// routes : 

// userDataCollectionRoutes !! 

// 1. Collect userDetails
app.post("/user",authorize,(req,res)=>{

        const Name = req.body.name;
        const Age = req.body.age;
        const Dob=req.body.dob;
        const PhoneNumber=req.body.phoneNumber;
        const Address=req.body.address;
        const Community=req.body.community;
        const PrimaryLanguage=req.body.primaryLanguage;
        const NumOfChild=req.body.numOfChild;
        const MaritalStatus=req.body.maritalStatus;
        const Income=req.body.income;
        const currentEducationLevel=req.body.currentEducationLevel;
        const literacyStatus=req.body.literacyStatus;
        const furtherStudyInterest=req.body.furtherStudyInterest;
        const currentEmployment=req.body.currentEmployment;
        const prevEmployment=req.body.prevEmployment;
        const jobTraining=req.body.jobTraining;
        const hospitalizationRecords=req.body.hospitalizationRecords;
        const prescripton=req.body.prescripton;
        const bloodGroup=req.body.bloodGroup;
        const Allergies=req.body.allergies;
        const healthInsurance=req.body.healthInsurance;
        const rationCard=req.body.rationCard;
        const aadharCard=req.body.aadharCard;
        const esharamCard=req.body.esharamCard;
        const panCard=req.body.panCard;
        const voterId=req.body.voterId;


        const currentUser = new User({
            basicDetails:{
                Name,
                Age,
                Dob,
                PhoneNumber,
                Address,
                Community,
                FamilyDetails:{
                    NumOfChild,
                    MaritalStatus,
                    Income
                },
                PrimaryLanguage
            },
            educationStatus:{
                currentEducationLevel,
                literacyStatus,
                furtherStudyInterest
            },
            employmentStatus:{
                currentEmployment,
                prevEmployment,
                jobTraining
            },
            medicalRecords:{
                hospitalizationRecords,
                prescripton,
                bloodGroup,
                Allergies,
                healthInsurance
            },
            govtSchemes:{
                rationCard,
                aadharCard,
                esharamCard,
                panCard,
                voterId
            }
        });


        User.insertMany([currentUser], function (err) {
          if (err) {
            res.status(500).json({message:err.message});
          } else {
             res.status(200).json({message:"Success !!"});
          }
        });

});


// 2. Collect EventDetails
// Will contains participants / attendance for each event !! 
// this will Ngo them create an event !!
// and post it's attendance !! and progress !!  
app.post("/event",authorize,async (req,res)=>{
    let participants=req.body.participants;// array of userObjects !!
    let feedbacks=req.body.feedbacks// array of objects !!     
    
    const attendance = [];
    const feedback=[];
  try {
    await Promise.all(
      participants.map(async (participant) => {
        const result = await User.find({ 'basicDetails.Name': participant.name });
        if (result.length > 0) {
        //   console.log(result[0]);
          attendance.push(result[0]);
        }
      })
    );

    await Promise.all(
        feedbacks.map(async (feedBack) => {
            console.log(feedBack.user.name);
          const result = await User.find({ 'basicDetails.Name': feedBack.user.name });
          if (result.length > 0) {
            // console.log(result[0]);
            feedback.push({
                user:result[0],
                content:feedBack.content
            });
          }
        })
      );

    const currentEvent=new Event({
        participants:attendance,
        feedback
    });

    Event.insertMany([currentEvent], function (err) {
        if (err) {
          res.status(500).json({message:err.message});
        } else {
          res.status(200).json({ message: "Success"});
        }
      });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }

});




app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log("Server Started");
})