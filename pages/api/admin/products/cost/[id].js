const Cost = require('../../../../../backend/controllers/cost.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':

            await Cost.createCost(req,res)
            break

        case 'PUT':

            await Cost.editCost(req,res)
            break

        case 'DELETE':

            await Cost.deleteCost(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}
