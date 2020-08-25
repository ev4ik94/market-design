const Review = require('../../../../controllers/review.controller');

export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'POST':

            await Review.createReview(req, res)
            break

        case 'GET':

            await Review.createProduct(req, res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
