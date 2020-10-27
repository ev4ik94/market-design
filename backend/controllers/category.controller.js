const db = require('../utils/db.config');
const Category = db.category;
const validator = require('validator');
const checkAuth = require ('../middleware/checkAuth');

exports.createCategory = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = {};

        data.title = validator.escape(body.title);
        data.slug = validator.escape(body.slug);
        data.parentId = body.parentId?body.parentId:null;

       await Category.create(data).
        then(result=>{
            res.status(201).json({success:true, data:result.dataValues});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })

    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getCategories = async (req, res) => {
    try{

        await Category.findAll({where:{parentId:null}})
            .then(result=>{
                if(!result.length){
                    return res.status(200).json({success:true, data: []})
                }

                let categories = [];

                 for(let value of result){
                     value.dataValues.children = []
                     categories.push(value.dataValues)
                 }

                 return categories;

            }).then(async(cat)=>{

                for(let value of cat){
                    await Category.findAll({where:{parentId:value.id}}).then(result=>{
                        if(result.length){
                            value.children = [...result];
                        }
                    })
                }

                res.status(200).json({success:true, data: cat})
            }).catch(err=>{
                res.status(400).json({success:false, message:err.message});
            })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.editCategory = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = {}

        for(let key in body){
            let el = validator.isAlphanumeric(validator.escape(body[key]));
            if(el){
                data[key] = body[key];
            }
        }

        data.parentId = body.parentId?Number(body.parentId):null;

        await Category.update(data, {
            where: {
                id: req.query.id
            }
        })
             .then(result=>{
                 res.status(200).json({success:true, data:result.dataValues})
             })

    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.deleteCategory = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }


        await Category.destroy({
            where: {
                id: req.query.id
            }
        }).then(()=>{
                res.status(200).json({success:true, message:'Category success deleted'})
            }).catch(err=>{
            res.status(400).json({success:true, message:err.message})
        })

    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}





