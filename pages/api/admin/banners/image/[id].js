const ImageBanner = require('../../../../../backend/controllers/image_banner.controller');

export const config = {
    api: {
        bodyParser: false,
    },
};


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':
            await ImageBanner.uploadFile(req,res)
            break


        

        default:
            res.status(400).json({success: false})
            break
    }
}
