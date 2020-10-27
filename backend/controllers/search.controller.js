const db = require('../utils/db.config');
const Product = db.product;
const Tag = db.tag;
const validator = require('validator');
const Sequelize = require('sequelize-next');
const Op = Sequelize.Op;

exports.searchProducts = async (req, res) => {
    try{

        const {query} = req;

        let params = [];
        let tagsParam = [];
        for(let value of query.params){
            params.push(validator.escape(value))
            tagsParam.push(`%${validator.escape(value)}%`)
        }

        let titleS = params.join(' ');




       Product.findAll({
           where:{ title: {[Op.like]: `%${titleS}%`}},
           include:["Images", "costs"],
           limit: 30
       })
            .then(result=>result)
           .then((titleSrch)=>{
               Tag.findAll(
                   {where:{title: {[Op.like]: { [Op.any]: tagsParam}}},
                       include:[{
                            model:Product,
                           as:"products",
                           include:["Images", "costs"]

                       }],
                       limit: 30
                   })
                   .then(result=>{
                       let dataArr = titleSrch && titleSrch !==null?titleSrch:[];
                      for(let value of result){
                          dataArr.push(value)
                      }
                      console.log(dataArr)
                       res.status(200).json({success:true, data:dataArr})
                   })
                   .catch(err=>{
                       res.status(400).json({success:false, message:err.message})
                   })
           })
            .catch(err=>{
            res.status(400).json({success:false, message:err.message})
        });




    }catch (e) {
        res.status(500).json({success:false, message:'Error server'});
    }
}
