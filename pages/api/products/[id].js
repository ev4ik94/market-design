const Product = require('../../../backend/controllers/product.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':

            await Product.getProduct(req,res)
            break
        

        default:
            res.status(400).json({success: false})
            break
    }
}
