const search = require('../../../backend/controllers/search.controller');


export default async (req, res)=>{

    const {method} = req

    switch(method){
        case 'GET':

            await search.searchProducts(req, res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
