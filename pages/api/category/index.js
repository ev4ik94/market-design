const Category = require('../../../backend/controllers/category.controller');

export default async (req, res)=>{
    const {method} = req

    switch(method){

        case 'POST':

            await Category.createCategory(req,res)
            break

        case 'GET':
            await Category.getCategories(req, res)
            break


        default:
            res.status(400).json({success: false})
            break
    }

}

