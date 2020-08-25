const multer = require('multer');
const path = require('path');
const compressorImage = require('compress-images');
const db = require('./../utils/db.config');
const Banner = db.banner;
const ImageBanner = db.image_banner;
const {checkFileType} = require('../utils/fn');


const OUTPUT_path = "./public/images/banners/min-";

const storage = multer.diskStorage({
    destination: path.resolve('./public/images/banners'),
    filename: function (req, file, cb){
        cb(null, file.fieldname + '.' + Date.now() + path.extname(file.originalname))
    }
})



const upload = multer({
    storage:storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('bannerImage');




exports.uploadFile = async(req, res)=>{

    try{

        upload(req, res, (err)=>{
            if(err){
                return res.status(400).json({success:false, message: err})
            }
            if(req.file===undefined){
                return res.status(400).json({success:false, message: 'File dont uploaded'})
            }

            compressorImage(`public/images/banners/${req.file.filename}`, OUTPUT_path,
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
                    }else{
                        const small = statistic.path_out_new.replace(/.\/public\//gi, '/');
                        await ImageBanner.update({
                                large: `/images/banners/${req.file.filename}`,
                                small},
                            {where:{banner_id:req.query.id}}).then(result=>{
                            return res.status(200).json({
                                message: 'File is uploaded',
                                data: {large: `/images/banners/${req.file.filename}`,
                                    small}
                            })
                        }).catch(err=>{
                            return res.status(400).json({
                                success: false,
                                message: err.message
                            })
                        })
                    }




                }
            );


        })




    }catch(err){
        res.status(500).json({success:false, message: err.message})
    }
}