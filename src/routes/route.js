const express = require("express");
const router = express.Router();
const authorcontroller = require("../controllers/authorController");
const blogController = require("../controllers/blogsController");
const middleware= require('../middlewares/auth')
const authorValidations=require('../validations/authorValidations')
const blogValidations= require('../validations/blogValidations')

// #All Api's

router.post("/authors",authorValidations.authorValidations, authorcontroller.createauthor);

router.post("/login",authorcontroller.loginAuthor);  

router.get("/getUserName",middleware.authentication,authorcontroller.getUserName);

router.get("/getPosterName/:id",middleware.authentication,authorcontroller.getPosterName);     

router.post("/blogs",middleware.authentication,blogValidations.blogValidations,blogController.createBlogs);

router.get("/blogs", middleware.authentication,blogController.getBlogs);
router.get("/getMyBlogs", middleware.authentication,blogController.getMyBlogs);

router.get("/blogs/:id", blogController.getBlogsById);


router.put("/blogs/:id",middleware.authentication,middleware.authorization,blogValidations.updateValidations,blogController.putBlogs);

router.delete("/blogs/:id", middleware.authentication,middleware.authorization,blogController.deleteBlogs);

router.delete("/blogs", middleware.authentication,middleware.authorization,blogController.deleteBlogsByQuery);

module.exports = router;




