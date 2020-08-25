const Banner = require('../../../../controllers/banner.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':
            await Banner.createBanner(req,res)
            break

        case 'GET':
            await Banner.getAllBanners(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
