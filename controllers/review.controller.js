const db = require('./../utils/db.config');
const Product = db.product;
const Review = db.review;
const validator = require('validator');
const checkAuth = require ('./../middleware/checkAuth');

exports.createReview = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = {};

        if(!validator.isEmail(validator.escape(body.email))) {
            return res.status(400).json({success: false, message: 'Invalid email'});
        }

        if(validator.isEmpty(validator.escape(body.name))) {
            return res.status(400).json({success: false, message: 'The name field must not be empty'});
        }

        if(validator.isEmpty(validator.escape(body.text))){
            return res.status(400).json({success: false, message: 'The review field must not be empty'})
        }


        for(let i in body){
            data[i] = validator.escape(body[i]);
        }




       await Product.findOne({where:{id:req.query.id}}).then(async(product)=>{

           if(product===null){
               res.status(404).json({success:false, message:'Product not found'});
           }

           product.createReview(data).then(result=>{
               res.status(201).json({success:true, data:result});
           }).catch(err=>{
               res.status(400).json({success:false, message:err.message});
           })


       }).catch(err=>{
           res.status(400).json({success:false, message:err.message});
       })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getAllReviews = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        Review.findAll({
            include:[{
                model: Product
            }]
        }).then(result=>{
            res.status(200).json({success:true, data:result});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getReview = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        Review.findOne({
            where:{id:req.query.id},
            include:[{
                model: Product
            }]
        }).then(result=>{
            let data = null;

            if(result!==null){
                data = result.dataValues;
            }

            res.status(200).json({success:true, data});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.editReview = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = {};


        if(validator.isEmpty(validator.escape(body.text))){
            return res.status(400).json({success: false, message: 'The review field must not be empty'})
        }


        for(let i in body){
            data[i] = validator.escape(body[i]);
        }


        Review.update(data,{where:{id:req.query.id}}).then(()=>{
            res.status(200).json({success:true, message:'Review edited successfully'});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })

    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.deleteReview = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }


        Review.destroy({where:{id:req.query.id}}).then(()=>{
            res.status(200).json({success:true, data:'Review deleted successfully'});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })

    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}