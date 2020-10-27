const db = require('../utils/db.config');
const UserModel = db.user;
const Address = db.address;
const Cart = db.cart;
const Product = db.product;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const checkAuth = require ('../middleware/checkAuth');
const Sequelize = require('sequelize-next');
const Op = Sequelize.Op;

exports.createUser = async (req, res) => {
    try{

        const {body} = req;
        const data = {};

        if(!validator.isEmail(validator.escape(body.email))) {
            return res.status(400).json({success: false, message: 'Invalid email'});
        }

        if(!validator.isByteLength(body.password, {min:6})){
            return res.status(400).json({success: false, message: 'Password must be at least 6 characters'})
        }

        data.email = body.email;
        data.password = await bcrypt.hash(body.password, 12);


            UserModel.create(data).then((user) => {

                res.status(201).json({
                    success:true,
                    message: 'User created successfully',
                    data: {user}
                })

         }).catch(err => {
             console.log(err)
             res.status(400).json({success:false, message:err.message});
         });


    }catch (e) {
        res.status(500).json({success:false, message:'Error server'});
    }
}

exports.loginUser = async function(req, res, role=0){

    try{
        const {email, password} = req.body;

        if(!validator.isEmail(validator.escape(email))) {
            return res.status(400).json({success: false, message: 'Invalid email'});
        }

        if(!validator.isAlphanumeric(validator.escape(password))){
            return res.status(400).json({success: false, message: 'Invalid password. Use only characters (A-z, 1-10)'});
        }

       await UserModel.findOne({

            where:{
                email,
                role
            }

        }).then(async(user)=>{
            if(user===null){ // если такого пользователя нет в базе
                return res.status(404).json({message: 'User is not found'});
            }

            const isMatch = await bcrypt.compare(password, user.dataValues.password);

            if(!isMatch){
                return res.status(400).json({message: 'Invalid password please try again'})
            }

            const token = jwt.sign({userId: user.dataValues.id},
                process.env.PASSWORD,
                {expiresIn: '24h'});

            const userData = await UserModel.findOne({
                where:{
                    email,role
                },
                attributes: ['id', 'email', 'name', 'last_name', 'created_at'],
                include: [
                    {
                        model: Address,
                        required: true

                    },
                    {
                        model: Cart,
                        as: "cart",
                        attributes:["type_cost", "buy"],
                        include: [
                            {
                                model: Product,
                                include: ["costs", "Images"]

                            }

                        ]

                    }
                ]
            })

            res.status(200).json({success:true, data:{
                    userId: user.dataValues.id,
                    token,
                    login:user.dataValues.email
                },
                userData
            });

        }).catch(err=>{
           res.status(400).json({success:false, message:err.message})
       })


    }catch(e){
        res.status(500).json({success:false, message:e.message})
    }
}

exports.updateUser = async function(req,res){

    try{
       const userId = req.query.id;

        let data = {};
        for(let value in req.body){
            if(value==='password'){
                data[value] = await bcrypt.hash(req.body.password, 12);
            }else{
                data[value] = validator.escape(req.body[value]);
            }
        }

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const userUpdate =  await UserModel.update(data, {
             where: {
                 id: userId
             }
         });
        if(!userUpdate[0]){
            return res.status(400).json({message: 'User is not found'});
        }

        res.json({success:true});

    }catch(e){

        res.status(500).json({success:false, message:'Error server'});
    }
}

exports.listAll = async (req, res) => {

    try{
        await checkAuth(req,res);
        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        await UserModel.findAll({
            attributes: ['id', 'email', 'name', 'last_name', 'created_at', 'updated_at'],
            where:{role:0},
            include: [
                {
                    model:Address,
                    attributes: ['city', 'country', 'postal_code', 'province', 'street']
                }
            ]
        }).then(user => {
            return res.status(201).json({
                success:true,
                data:user} )
        }).catch(err => {
            return res.status(400).json({success: false, message: err.message});
        });
    }catch(err){
        return res.status(400).json({success: false, message: err.message});
    }
}

exports.getOne = async (req, res) => {


    await UserModel.findOne({
        attributes: ['id', 'email', 'name', 'last_name', 'created_at', 'updated_at'],
        where:
            {
                role:0,
                id:req.query.id
            },
        include: [
            {
                model: Address,
                attributes: ['city', 'country', 'postal_code', 'province', 'street']

            }
        ]
    }).
    then(user => {

        return res.status(200).json({
            success:true,
            data: user.dataValues
        })

    })

        .catch(err => {
        return res.status(400).json({success: false, message: err.message});
    });



}


exports.deleteUser = async (req, res) => {

    await checkAuth(req,res);
    if(!req.user){
        return res.status(401).json({message: 'You are not logged in'});
    }
    UserModel.destroy({where:{id:req.query.id}}).then(()=>{
        Address.destroy({where:{user_id:req.query.id}}).then(()=>{
            res.status(200).json({message: 'This user was delete success'})
        }).catch(err=>{
            res.status(400).json({success: false, message: err});
        })
    })
        .catch(err => {
        return res.status(400).json({success: false, message: err});
    });



}

