const Banner = require('./../../../controllers/banner.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':
            await Banner.getBanners(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
