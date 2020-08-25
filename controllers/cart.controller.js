const db = require('./../utils/db.config');
const Cart = db.cart;
const Product = db.product;
const User = db.user;
const validator = require('validator');
const checkAuth = require ('./../middleware/checkAuth');


exports.addToCart = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const userId = req.query.params.length && req.query.params[0]?req.query.params[0]:null;
        const productId = req.query.params.length && req.query.params[1]?req.query.params[1]:null;
        const data = {};

         data.type_cost = validator.escape(body.type_cost);

         if((userId && userId!==null) && (productId && productId!==null)){

             const user = await User.findOne({where:{id:userId}});
             const product = await Product.findOne({where:{id:productId}});

             await Cart.create({type_cost:''}).then(cart=>{
                 cart.setUser(user).then(()=>{
                     cart.setProduct(product).then(()=>{
                         res.status(200).json({success:true});
                     }).catch(err=>{
                         res.status(400).json({success:false, message:err.message});
                     })
                 }).catch(err=>{
                     res.status(400).json({success:false, message:err.message});
                 })
             }).catch(err=>{
                 res.status(400).json({success:false, message:err.message});
             })
         }


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getCart = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }


        const userId = req.query.params.length && req.query.params[0]?req.query.params[0]:null;



        if(userId && userId!==null){

            await Cart.findAll({where:{user_id:userId}}).then(result=>{
                res.status(200).json({success:true, data:result});
            }).catch(err=>{
                res.status(400).json({success:false, message:err.message});
            })
        }


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}