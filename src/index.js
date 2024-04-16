const express = require("express");
const route = require("./routes/route");
const mongoose = require("mongoose");
const a = require("dotenv").config();
const cors = require('cors');  
const app = express();
const port = process.env.PORT ;
    

app.use(express.json());
app.use(cors())
mongoose.connect(process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
    }   
  )   
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));
  
app.use("/", route);   
app.use("/**",(req,res)=>{
      res.status(400).send("write valid url")
})  
app.listen(port, function () {
  console.log("Express app running on port " + ( port));
});   
