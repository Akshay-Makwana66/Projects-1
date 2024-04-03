const authormodel = require("../models/authorModel");
const jwt =require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10
// ### Author API /authors
const createauthor = async function (req, res) {                   
  try { 
    let data= req.body;
 // Creating the author document in DB
 data.password = await bcrypt.hash(data.password,saltRounds)

    let save = await authormodel.create(data);  

    res.status(201).send({ status: true, data: save });  

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const loginAuthor= async function(req,res){  
  try{
    let data = req.body

    // Checks whether body is empty or not
    if (Object.keys(data).length == 0)return res.status(400).send({ status: false, message: "Body cannot be empty"});

    // Checks whether email is entered or not
    if (!data.email || !data.password) return res.status(400).send({ status: false, message: "Please enter Email and Password"});
    let userEmail= data.email
    let userPassword= data.password

    //Checks if the email or password is correct
    let checkCred= await authormodel.findOne({email: userEmail})
    if(!checkCred) return res.status(401).send({status:false, message:"Email or password is incorrect"})

    
      let decryptPassword = await bcrypt.compare(userPassword,checkCred.password)
      if(!decryptPassword){
        return res.status(401).send({status:false,message:"Email or password is incorrect"})
      }else{

        //Creating token if e-mail and password is correct
        let token= jwt.sign({
          authorId: checkCred._id.toString(),   
          batch:"Radon"
        }, "project1-AADI");
        //Setting token in response header
        // res.setHeader("x-api-key",token)       
        res.status(201).send({status:true,data: token})
      }
    
  }catch (error) {
  res.status(500).send({ status: false, message: error.message});
  }
}

module.exports = { createauthor,loginAuthor };
