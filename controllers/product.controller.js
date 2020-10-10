const db = require('./../utils/db.config');
const Product = db.product;
const Category = db.category;
const Image = db.image;
const Cost = db.cost;
const Tag = db.tag;
const validator = require('validator');
const checkAuth = require ('./../middleware/checkAuth');
const Sequelize = require('sequelize-next');
const Op = Sequelize.Op;


exports.createProduct = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = {};
        const catId = body.catId?Number(body.catId):null;

        for(let i in body){
            let el = validator.isEmpty(body[i]);
            if(!el){
                data[i] = validator.escape(body[i]);
            }
        }
        data.category_id = catId;

        await Product.create(data).
        then(product=>{
            res.status(201).json({success:true, data: product});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.editProduct = async (req, res) => {
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


        await Product.update(data, {where:{id:req.query.id}}).
        then(()=>{
            res.status(200).json({success:true, message: 'Product updated success'});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.deleteProduct = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }


        await Product.destroy({where:{id:req.query.id}}).
        then(()=>{

            res.status(200).json({success:true, message: 'Product removed successfully'});
        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getProduct = async (req, res) => {
    try{

        await Product.findOne({
            where:{id:req.query.id},
            attributes: ["id", "createdAt", "description", "publish", "title"],
            include:["Images", "costs", "tags", "review", "categories"]
        }).
        then((result)=>{

            let data = null;
            if(result && result!==null){
                data = result.dataValues;
            }

            res.status(200).json({success:true, data });

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}

exports.getProductCategory = async (req, res) => {
    try{

        const id = req.query.params.length?req.query.params[0]:null;
        const catid = req.query.params.length?req.query.params[1]:null;

        if(id!==null && catid!==null){
            await Product.findAll({
                where:{category_id:catid, id:{[Op.ne]: id}},
                attributes: ["id", "category_id", "createdAt", "description", "publish", "title"],
                include:["Images", "costs", "tags", "review", "categories"],
                limit:3
            }).
            then((result)=>{

                res.status(200).json({success:true, data:result });

            }).catch(err=>{
                res.status(400).json({success:false, message:err.message});
            })
        }



    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getActiveAll = async (req, res) => {
    try{

        const {page, limit, parentid, catid, recent, popular, tag} =req.query;
        let categories = [];





        if(parentid) {

            await Category.findAll({where: {parentId: parentid}}).then(result => {
                for (let val of result) {
                    categories.push({category_id: val.id});
                }
            });

            await Product.findAndCountAll({
                where:{[Op.or]: categories, publish:true},
                include:[
                    {
                        model:Image,
                        as:"Images",
                        order: [['createdAt', 'DESC']]
                    },
                    "costs",
                    tag?{
                        model:Tag,
                        as: "tags",
                        where: {
                            title: tag
                        }

                    }:"tags"
                    ],
                distinct:true,
                attributes: [
                    'id',
                    'title',
                    'description',
                    'publish',
                    'createdAt',
                    'updatedAt',
                    'category_id',
                    [Sequelize.literal(`(SELECT COUNT(*) FROM "cart" WHERE "cart"."product_id" = "Product"."id")`),"cnt"]
                ],
                order: recent>0?[['updatedAt', 'DESC']]:(popular>0?[[Sequelize.literal('cnt'), 'DESC']]:''),

                limit,
                offset: 0 + (page - 1) * limit
            }).then(result=>{
                res.status(200).json({success:true, data:result })
            }).catch(err=>{res.status(400).json({success:false, message:err.message })})

        }else if(catid){

            await Product.findAndCountAll({
                where:{category_id:catid, publish:true},
                include:["Images", "costs", "tags"],
                distinct:true,
                attributes: [
                    'id',
                    'title',
                    'description',
                    'publish',
                    'createdAt',
                    'updatedAt',
                    'category_id',
                    [Sequelize.literal(`(SELECT COUNT(*) FROM "cart" WHERE "cart"."product_id" = "Product"."id")`),"cnt"]
                ],
                order: recent>0?[['updatedAt', 'DESC']]:(popular>0?[[Sequelize.literal('cnt'), 'DESC']]:''),
                limit,
                offset: 0 + (page - 1) * limit
            }).then(result=>{
                res.status(200).json({success:true, data:result })
            }).catch(err=>{res.status(400).json({success:false, message:err.message })})

        }



    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}

exports.getAll = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        await Product.findAll({include:["Images", "costs", "tags"]}).
        then((result)=>{

            res.status(200).json({success:true, data:result });

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}

exports.getProductsBySlug = async (req, res) => {
    try{


       await Product.findAll({include:["Images", "costs", {
            model:Tag,
               as: "tags",
                    where: {
                        title: req.query.slug
                    }

            }]}).
        then((result)=>{

            res.status(200).json({success:true, data:result });

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}













