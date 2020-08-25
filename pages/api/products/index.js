const Product = require('../../../controllers/product.controller');


export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':

            await Product.getActiveAll(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}