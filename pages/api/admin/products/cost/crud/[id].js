const Cost = require('../../../../../../controllers/cost.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){

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
