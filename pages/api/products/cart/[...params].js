const Cart = require('../../../../backend/controllers/cart.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':
            await Cart.addToCart(req, res);
            break

        case 'GET':

            await Cart.getCart(req, res);
            break

        case 'DELETE':
            await Cart.deleteCart(req, res);
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
