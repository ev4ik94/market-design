const db = require('../utils/db.config');
const Product = db.product;
const Tag = db.tag;
const validator = require('validator');
const checkAuth = require ('../middleware/checkAuth');

exports.createTag = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = {};


        for(let i in body){
            let el = validator.isEmpty(body[i]);
            if(!el){
                data[i] = validator.escape(body[i]);
            }
        }



       await Product.findOne({where:{id:req.query.id}}).then(product=>{
           product.createTag(data).then(result=>{
               res.status(201).json({success:true, message:'Tag is created successful', data:result})
           }).catch(err=>{
               res.status(400).json({success:false, message:err.message})
           })
       }).catch(err=>{
           res.status(400).json({success:false, message:err.message});
       })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getProductsByTag = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }





    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getTagList = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        Tag.findAll().then(result=>{
            res.status(200).json({success:true, data:result});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })



    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}

exports.addTagProduct = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = {};


        for(let i in body){
            let el = validator.isEmpty(body[i]);
            if(!el){
                data[i] = validator.escape(body[i]);
            }
        }

        const tag = await Tag.findOne({where:{title:data.title}});

        await Product.findOne({where:{id:req.query.id}}).then(product=>{
            product.hasTag(tag).then(result=>{

                res.status(200).json({success:true, data:result});
                if(result){
                    res.status(400).json({success:false, message: 'This tag already exists on the product'});
                }

                product.addTag(tag).then(result=>{
                    res.status(200).json({success:true, data:result, message: 'Tag added successfully'});
                }).catch(err=>{
                    res.status(400).json({success:false, message: err.message});
                })
            }).catch(err=>{
                res.status(400).json({success:false, message: err.message});
            })
        }).catch(err=>{
            res.status(400).json({success:false, message: err.message});
        })



    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}



exports.deleteTag = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        await Tag.destroy({where:{title:req.query.slug}}).then(()=>{
            res.status(200).json({success:true, message: 'Tag deleted is successfully'});
        }).catch(err=>{
            res.status(400).json({success:false, message: err.message});
        })



    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}
