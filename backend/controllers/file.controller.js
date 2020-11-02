const checkAuth = require ('../middleware/checkAuth');
const multer = require('multer');
const path = require('path');
const db = require('../utils/db.config');
const File = db.file;
const Product = db.product;


const checkFileType = (file, cb)=>{

    const filtypes = /rar|zip/;

    const extname = filtypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filtypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null, true);
    }else{
        cb('Error: Only Files!');
    }

}

const storage = multer.diskStorage({
    destination: path.resolve('./public/file'),
    filename: function (req, file, cb){
        cb(null, file.fieldname + '.' + Date.now() + path.extname(file.originalname))
    }
})



const upload = multer({
    storage:storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('peelPic');


exports.fileUpload = async (req, res) => {

    await checkAuth(req,res);

    if(!req.user){
        return res.status(401).json({message: 'You are not logged in'});
    }

    upload(req, res, async (err)=> {
        if (err) {
            res.status(400).json({success: false, message: err})
        }
        if (req.file === undefined) {
            res.status(400).json({success: false, message: 'File dont uploaded'})
        }


        await File.create({file_name:req.file.filename, publish:false, product_id:1})
            .then(()=>{
                res.status(200).json({success: true})
            }).catch(err=>res.status(400).json({success: false, message: err.message}))

    })

}

exports.getFiles = async(req,res)=>{
    await checkAuth(req,res);

    if(!req.user){
        return res.status(401).json({message: 'You are not logged in'});
    }

    await File.findAll({
        where: {publish:true},
        include:[{
            model: Product
        }]
    })
        .then(result=>{
            res.status(200).json({success: true, data: result})
        })
        .catch(err=>{
            res.status(400).json({success: false, message: err.message})
        })
}
