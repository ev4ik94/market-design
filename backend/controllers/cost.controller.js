const db = require('../utils/db.config');
const Cost = db.cost;
const Product = db.product;
const validator = require('validator');
const checkAuth = require ('../middleware/checkAuth');

exports.createCost = async (req, res) => {
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
            if(product!==null){
                product.createCost(data).then(result=>{
                    res.status(200).json({success:true, data:result,message: 'Cost is created successfuly'});
                }).catch(err=>{
                    res.status(400).json({success:true, data: err.message})
                })
            }
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}

exports.editCost = async (req, res) => {
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

        await Cost.update({cost:data.cost, discount:data.discount},{where:{product_id:req.query.id, type:data.type}}).then(()=>{
            res.status(200).json({success:true, message: 'Cost is updated successfuly'});
        }).catch(err=>{
            res.status(400).json({success:true, message: err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}

exports.deleteCost = async (req, res) => {
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


        await Cost.destroy({where:{product_id:req.query.id, type:data.type}}).then(()=>{
            res.status(200).json({success:true, message: 'Cost is deleted successfuly'});
        }).catch(err=>{
            res.status(400).json({success:true, message: err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


