const Tag = require('../../../../../backend/controllers/tag.controller');




export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':

            await Tag.getTagList(req,res)
            break


        default:
            res.status(400).json({success: false})
            break
    }
}
