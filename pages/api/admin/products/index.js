const Product = require('../../../../backend/controllers/product.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':
            await Product.getAll(req,res)
            break

        case 'POST':
            await Product.createProduct(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
