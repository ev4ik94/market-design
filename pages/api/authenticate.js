const userWork = require('./../../controllers/user.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':
            await userWork.loginUser(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
