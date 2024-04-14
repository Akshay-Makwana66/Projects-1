const express = require("express");
const router = express.Router();
const { createauthor,loginAuthor ,getUserName,getPosterName} = require("../controllers/authorController");
const {createBlogs, getBlogs,getBlogsById,getMyBlogs, putBlogs, deleteBlogs, deleteBlogsByQuery} = require("../controllers/blogsController");
const { authentication, authorization}= require('../middlewares/auth')
const { authorValidations }=require('../validations/authorValidations')
const { blogValidations, updateValidations }= require('../validations/blogValidations')

// #All Api's

// Author Api's-------------------
router.post("/authors",authorValidations, createauthor);
router.post("/login",loginAuthor);  
router.get("/getUserName",authentication,getUserName);
router.get("/getPosterName/:id",authentication,getPosterName);     

//Author Blogs Api's
router.post("/blogs",authentication,blogValidations,createBlogs);
router.get("/blogs", authentication,getBlogs);
router.get("/getMyBlogs", authentication,getMyBlogs);
router.get("/blogs/:id", getBlogsById);
router.put("/blogs/:id",authentication,authorization,updateValidations,putBlogs);
router.delete("/blogs/:id", authentication,authorization,deleteBlogs);
router.delete("/blogs", authentication,authorization,deleteBlogsByQuery);

module.exports = router;




