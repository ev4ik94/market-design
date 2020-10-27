const addressControl = require('../../../backend/controllers/address.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){
        case 'GET':
            await userWork.getOne(req,res)
            break

        case 'PUT':
            await userWork.updateUser(req,res)
            break

        case 'DELETE':

            await userWork.deleteUser(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
