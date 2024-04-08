const authormodel = require("../models/authorModel");
const blogsModel = require("../models/blogsModel");

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
    res.status(500).send({ status: false, err: error.message,message:"Sorry for the inconvenience caused"});
  }
};

const loginAuthor= async function(req,res){  
  try{
    let data = req.body

    // Checks whether body is empty or not
    if (Object.keys(data).length == 0)return res.status(400).send({ status: false, message: "*Body cannot be empty"});

    // Checks whether email is entered or not
    if (!data.email || !data.password) return res.status(400).send({ status: false, message: "*Please enter Email and Password"});
    let userEmail= data.email
    let userPassword= data.password

    //Checks if the email or password is correct
    let checkCred= await authormodel.findOne({email: userEmail})
    if(!checkCred) return res.status(401).send({status:false, message:"*Email or password is incorrect"})

    
      let decryptPassword = await bcrypt.compare(userPassword,checkCred.password)
      if(!decryptPassword){
        return res.status(401).send({status:false,message:"*Email or password is incorrect"})
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
    res.status(500).send({ status: false, err: error.message,message:"Sorry for the inconvenience caused"});
  }
}

const getUserName = async (req, res) => {
  try {
      let user = await authormodel.findOne({ _id: req.authorId });
      if (!user) {
          return res.status(404).send({ status: false, message: "user not found" });
      } else {
          let capitalizedFirstName = user.fname.charAt(0).toUpperCase() + user.fname.slice(1); // Capitalize first letter of first name
          let capitalizedLastName = user.lname.charAt(0).toUpperCase() + user.lname.slice(1); // Capitalize first letter of last name
          let userName = `${capitalizedFirstName} ${capitalizedLastName}`; // Combine with last name
          return res.status(200).send({ status: true, name: userName });
      }
  } catch (error) {
      res.status(500).send({ status: false, err: error.message, message: "Sorry for the inconvenience caused" });
  }
}

const getPosterName = async (req, res) => {
  try {
    let blogId = req.params.id; 
    
    // Fetching the blogs
    let postName = await blogsModel.findOne({_id:blogId}).populate({path:'authorId',select:'fname lname'})
    if(!postName){
      return res.status(404).send({ status: false, message: "*No Blogs found" });
    } else {
      let capitalizedFirstName = postName.authorId.fname.charAt(0).toUpperCase() + postName.authorId.fname.slice(1); // Capitalize first letter of first name
      let capitalizedLastName = postName.authorId.lname.charAt(0).toUpperCase() + postName.authorId.lname.slice(1); // Capitalize first letter of last name
      let postname = `${capitalizedFirstName} ${capitalizedLastName}`; // Combine with last name
      return res.status(200).send({ status: true, postername: postname });
    }
  } catch (error) {   
    res.status(500).send({ status: false, err: error.message, message: "Sorry for the inconvenience caused" });        
  }
}


module.exports = { createauthor,loginAuthor ,getUserName,getPosterName};
