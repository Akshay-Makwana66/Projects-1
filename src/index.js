const express = require("express");
const route = require("./routes/route");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require('cors');  
const app = express();
const port = process.env.PORT ; 

app.use(express.json());
app.use(cors())
mongoose.connect("mongodb+srv://AkshayMakwana:Akshay123@cluster0.zmta9.mongodb.net/AADI-DB",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);     

app.listen(port, function () {
  console.log("Express app running on port " + ( port));
});   
   
