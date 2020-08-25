const Category = require('../../../controllers/category.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){


        case 'PUT':
            await Category.editCategory(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}