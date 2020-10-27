const path = require('path');

exports.checkFileType = (file, cb)=>{

    const filtypes = /jpeg|jpg|png|gif/;

    const extname = filtypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filtypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null, true);
    }else{
        cb('Error: Only Image!');
    }

}