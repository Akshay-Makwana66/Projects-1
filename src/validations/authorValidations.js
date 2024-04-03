const authormodel = require("../models/authorModel");

const authorValidations = async function (req, res, next) {
  try {
    let data = req.body; 
    // Checks whether body is empty or not

    if (Object.keys(data).length == 0)return res.status(400).send({ status: false, message: "Body cannot be empty" });

    // Checks whether first name is empty or is enter as a string or contains only letters

    if (!data.fname)return res.status(400).send({ status: false, message: "Please enter Fname" });

    if (typeof data.fname !== "string")return res.status(400).send({ status: false, message: " Please enter fname as a String" });

    let validfname = /^\w[a-zA-Z.]*$/;
   
    data.fname = data.fname.trim();

    if (!validfname.test(data.fname))return res.status(400).send({ status: false, message: "The fname may contain only letters" });

    // Checks whether last name is empty or is enter as a string or contains only letters

    if (!data.lname)return res.status(400).send({ status: false, message: "Please enter Lname" });

    if (typeof data.lname !== "string")return res.status(400).send({ status: false, message: "Please enter lname as a String" });

    let validlname = /^\w[a-zA-Z.]*$/;

    data.lname = data.lname.trim();

    if (!validlname.test(data.lname))return res.status(400).send({ status: false, message: "The lname may contain only letters" });

    // Checks whether title is empty or is enter as a string or contains the enumerator values or not.
    if (!data.title)return res.status(400).send({ status: false, message: " Please enter Title" });

    if (typeof data.title !== "string")return res.status(400).send({ status: false, message: "Please enter title as a String" });
     
    let titles = ["Mr", "Mrs", "Miss"];
         
    data.title = data.title.trim();

    if (!titles.includes(data.title))return res.status(400).send({status: false,message: "Please enter title as Mr, Mrs or Miss only",});

    // Checks whether password is empty or is enter as a string or a valid pasword.
    if (!data.password)return res.status(400).send({ status: false, message: "Please enter Password" });

    if (typeof data.password !== "string")return res.status(400).send({ status: false, message: " Please enter password as a String" });

    let validPassword =/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!validPassword.test(data.password))return res.status(400).send({status: false,message: "Please enter min 8 letter password, with at least a symbol, upper and lower case letters and a number"});

    // Checks whether email is empty or is enter as a string or is a valid email or already exists

    if (!data.email)return res.status(400).send({ status: false, message: "Please enter E-mail" });

    if (typeof data.email !== "string")return res.status(400).send({ status: false, message: "Please enter email as a String" });

    let email = data.email;
     if (!/^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email))return res.status(400).send({ status: false, message: "Entered email is invalid" });

    let duplicateEmail = await authormodel.find({ email: email });

    if (duplicateEmail.length !== 0)return res.status(400).send({ status: false, message: `This email ${email} is already used` });

    next();
    
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authorValidations };
