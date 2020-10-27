const Banner = require('../../../../backend/controllers/banner.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':
            await Banner.getBanner(req,res)
            break

        case 'PUT':
            await Banner.updateBanner(req,res)
            break


        case 'DELETE':
            await Banner.deleteBanner(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
