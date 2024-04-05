const blogsModel = require("../models/blogsModel");
const mongoose = require("mongoose");

// ### POST /blogs
const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    let save = await blogsModel.create(data);
    res.status(201).send({ status: true, data: save });
    
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ## GET /blogs

const getBlogs = async function (req, res) {
  try {
    let conditions = req.query; 
        
    // Checks whether author id isa valid ObjectId                                                
      if(conditions.authorId) {
        if (!mongoose.isValidObjectId(conditions.authorId))return res.status(400).send({ status: false, msg: "*Please Enter authorID as a valid ObjectId" })}
        
    // Fetching the blogs
    let blogs = await blogsModel.find({$and: [conditions, { isDeleted: false }]});
        
    if (blogs.length == 0)return res.status(404).send({ status: false, msg: "*No Blogs found" });

    res.status(200).send({ status: true, data: blogs });  

  } catch (error) {        
    console.log(error);   
    res.status(500).send({ status: false, msg: error.message });          
  }
};


const getBlogsById = async function (req, res) {
  try {
    let blogId = req.params.id; 
    
    // Fetching the blogs
    let blogs = await blogsModel.findOne({_id:blogId});
    if (blogs.length == 0)return res.status(404).send({ status: false, msg: "*No Blogs found" });

    res.status(200).send({ status: true, data: blogs });  

  } catch (error) {   
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });          
  }
};

// ### PUT /blogs/:id

const putBlogs = async function (req, res) {
  try {
    let blogId = req.params.id;    
    let blogData = req.body;
    if(blogData.isPublished === true){
      blogData.publishedAt= Date.now()
    }else if(blogData.isPublished === false){
      blogData.publishedAt=null;
    }
    //Updating the Blog
    let updatedBlog = await blogsModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false }, //Checks weather document is deleted or not { _id: blogId },
      {
        title: blogData.title,
        body: blogData.body,
        tags: blogData.tags,
        category:blogData.category,
        subcategory: blogData.subcategory, 
        isPublished: blogData.isPublished,
        publishedAt: blogData.publishedAt,
      }, 
      { new: true }
    );
      

    if(!updatedBlog) return res.status(404).send({status:false,msg:"*No blogs found"})

    res.status(200).send({ status: true, data: updatedBlog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  } 
};

// ### DELETE /blogs/:id

const deleteBlogs = async function (req, res) {
  try {
    let blogId = req.params.id;
        
    //Deleting blog and adding timestamp
    let blog = await blogsModel.findOneAndUpdate(
      { _id: blogId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: Date.now() } }
    );
    if (!blog) {
      return res.status(404).send({ status: false, msg: "*Blog Not Found" });
    }
    res.status(200).send({ status: true, msg: "*Document is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

// ### DELETE /blogs?queryParams

const deleteBlogsByQuery = async function (req, res) {

  try {    
    let conditions = req.query;
    //Checks whether query params is empty or not2
    if (Object.keys(conditions).length == 0)  return res.status(400).send({ status: false, msg: "*Query Params cannot be empty" });
    let filters = {
      isDeleted:false,
      authorId:req.authorId,
      isPublished: false  
    }
      if(conditions.authorId) { 
        if(conditions.authorId != req.authorId) return res.status(403).send({ status: false, msg: "*Author is not authorized to access this data"})      
      }

      if(conditions.tags) filters.tags={$in:conditions.tags};
      if(conditions.category)filters.category={$in:conditions.category};
      if(conditions.subcategory) filters.subcategory={$in:conditions.subcategory};
    
     
      let deleteBlogs = await blogsModel.updateMany(filters,{ $set: { isDeleted: true, deletedAt: Date.now()}});   
    //  let deleteBlogs= await blogsmodel.updateMany({isDeleted:true},{$set:{isDeleted:false,deletedAt:null}})         
    if (deleteBlogs.matchedCount == 0) { 
      return res.status(404).send({ status: false, msg: "*Blog Not Found" });
    }
    res.status(200).send({ status: true, msg: "*Document is deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = {createBlogs, getBlogs,getBlogsById, putBlogs, deleteBlogs, deleteBlogsByQuery}