const userWork = require('../../../controllers/user.controller');
const Address = require('../../../controllers/address.controller');

export default async (req, res)=>{

    const {method} = req;

    switch(method){

        case 'PUT':
            await Address.editAddress(req,res)
            break

        case 'POST':
            await Address.createAddress(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}
