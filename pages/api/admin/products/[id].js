const Product = require('../../../../controllers/product.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':
            await Product.getProduct(req,res)
            break

        case 'PUT':
            await Product.editProduct(req,res)
            break

        case 'DELETE':
            await Product.deleteProduct(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
