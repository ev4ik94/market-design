const Product = require('../../../../controllers/product.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':

            await Product.getProductCategory(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}
