const Tag = require('../../../../../controllers/tag.controller');




export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':

            await Tag.createTag(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}
