const multer = require('multer');
const path = require('path');
const compressorImage = require('compress-images');
const db = require('../utils/db.config');
const Product = db.product;
const Image = db.image;
const {checkFileType} = require('../utils/fn');
const checkAuth = require ('../middleware/checkAuth');

const OUTPUT_path = "./public/images/shop-products/min-";

 const storage = multer.diskStorage({
     destination: path.resolve('./public/images/shop-products'),
     filename: function (req, file, cb){
         cb(null, file.fieldname + '.' + Date.now() + path.extname(file.originalname))
     }
 })



 const upload = multer({
     storage:storage,
     fileFilter: function(req, file, cb){
         checkFileType(file, cb);
     }
 }).single('productImage');




exports.uploadFile = async(req, res)=>{

    try{

         upload(req, res, (err)=>{
            if(err){
               res.status(400).json({success:false, message: err})
            }
            if(req.file===undefined){
                res.status(400).json({success:false, message: 'File dont uploaded'})
            }



            compressorImage(`public/images/products/${req.file.filename}`, OUTPUT_path,
                { compress_force: false,
                    statistic: true,
                    autoupdate: true },
                false,
                { jpg: { engine: "mozjpeg", command: ["-quality", "20"] } },
                { png: { engine: "pngquant", command: ["--quality=10-20"] } },
                { svg: { engine: false } },
                { gif: { engine: false} },
                async function  (error, completed, statistic) {

                    if(error!==null){
                        res.status(400).json({success:false, message: error})
                    }

                    const small = statistic.path_out_new.replace(/.\/public\//gi, '/');

                   await Product.findOne({where:{id:req.query.id}}).then(product=>{
                       product.createImage({
                           large: `/images/products/${req.file.filename}`,
                           small
                       }).then(result=>{
                           res.status(201).json({
                               message: 'File is uploaded',
                               data: result
                           })
                       }).catch(err=>{
                           res.status(400).json({
                               success: false,
                               message: err.message
                           })
                       })
                    }).catch(err=>{
                       res.status(400).json({
                           success: false,
                           message: err.message
                       })
                   })


                }
            );
            

        })




    }catch(err){
        res.status(500).json({success:false, message: err.message})
    }
}



exports.deleteImage = async(req, res)=>{

    try{


        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }


        Image.destroy({where:{id:req.query.id}}).then(result=>{
            res.status(200).json({success:true, message: 'Image successfully deleted'})
        }).catch(err=>{
            res.status(400).json({success:false, message: err.message})
        })


    }catch(err){
        res.status(500).json({success:false, message: err.message})
    }
}


exports.setMain = async(req, res)=>{

    try{


        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const id = req.query.params[0];
        const productid = req.query.params[1];


        await Image.update({main:false},{where:{main:true, product_id:productid}})
            .catch(err=>{res.status(400).json({success:false, message: 'update 1'+err.message})})

        await Image.update({main:true},{where:{id}}).then(()=>{
            res.status(200).json({success:true, data:{query:req.query}})
        }).catch(err=>{
            res.status(400).json({success:false, message: 'update 2 '+req.query+' '+err.message})
        })





    }catch(err){
        res.status(500).json({success:false, message: err.message})
    }
}
