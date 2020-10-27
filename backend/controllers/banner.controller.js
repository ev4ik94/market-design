const db = require('../utils/db.config');
const Banner = db.banner;
const ImageBanner = db.image_banner;
const validator = require('validator');
const checkAuth = require ('../middleware/checkAuth');

exports.createBanner = async (req, res) => {
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


        await Banner.create(data).
        then(banner=>{

            banner.createImageBanner({large:null,small:null}).then(image=>{
                res.status(201).json({success:true, data: {banner,image}})
            }).catch(err=>res.status(400).json({success:true, data: err.message}))

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getBanners = async (req, res) => {
    try{

        await Banner.findAll({
            where:{
                publish: true
            },
            include:["ImageBanner"]
        }).
        then(banner=>{

            res.status(200).json({success:true, data:banner});

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getAllBanners = async (req, res) => {
    try{


            await checkAuth(req,res);

            if(!req.user){
                return res.status(401).json({message: 'You are not logged in'});
            }


        await Banner.findAll({
            include:["ImageBanner"]
        }).
        then(banner=>{

            res.status(200).json({success:true, data:banner});

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.getBanner = async (req, res) => {
    try{


        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }


        await Banner.findOne({
            where: {
                id: req.query.id
            },
            include:["ImageBanner"]
        }).
        then(result=>{

            res.status(200).json({success:true, data:result});

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.deleteBanner = async (req, res) => {
    try{


        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }




        await Banner.destroy({
            where: {
                id: req.query.id
            }
        }).
        then(()=>{

            res.status(200).json({success:true, message:'Banner removed successfully'});

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}


exports.updateBanner = async (req, res) => {
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
                data[i] = body[i];
            }
        }


        await Banner.update(data,{
            where: {
                id: req.query.id
            }
        }).
        then(()=>{

            res.status(200).json({success:true, message:'Banner updated successfully'});

        }).catch(err=>{
            res.status(400).json({success:false, message:err.message});
        })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}
