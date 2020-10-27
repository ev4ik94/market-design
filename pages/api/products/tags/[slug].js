const Product = require('../../../../backend/controllers/product.controller');
const Tag = require('../../../../backend/controllers/tag.controller');
export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':

            await Product.getProductsBySlug(req,res)
            break

        case 'DELETE':

            await Tag.deleteTag(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
