const userWork = require('../../../backend/controllers/user.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){
        case 'GET':
           await userWork.listAll(req,res)
            break

        case 'POST':
            await userWork.createUser(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
