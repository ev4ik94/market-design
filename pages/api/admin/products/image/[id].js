const Image = require('../../../../../backend/controllers/image.controller');


export const config = {
    api: {
        bodyParser: false,
    },
};


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':

            await Image.uploadFile(req,res)
            break

        case 'DELETE':

            await Image.deleteImage(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}
