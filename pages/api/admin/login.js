const userWork = require('../../../backend/controllers/user.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':
            await userWork.loginUser(req,res, 1)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
