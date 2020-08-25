const Image = require('../../../../../controllers/image.controller');





export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'PUT':

            await Image.setMain(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}
