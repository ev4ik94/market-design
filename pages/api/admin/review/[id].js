const Review = require('../../../../backend/controllers/review.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':
            await Review.getReview(req,res)
            break

        case 'PUT':
            await Review.editReview(req,res)
            break

        case 'DELETE':
            await Review.deleteReview(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
