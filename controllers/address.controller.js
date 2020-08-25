const db = require('./../utils/db.config');
const Address = db.address;
const validator = require('validator');
const checkAuth = require ('./../middleware/checkAuth');



exports.editAddress = async (req, res) => {
    try{

        await checkAuth(req,res);

        if(!req.user){
            return res.status(401).json({message: 'You are not logged in'});
        }

        const {body} = req;
        const data = [];


        for(let i in body){
            let el = validator.isEmpty(body[i]);
            if(!el){
                data.push(validator.escape(body[i]))
            }
        }


       await Address.update({address:data.join(' ')},{
            where: {user_id:req.query.id}
        }).then(()=>{
            res.status(200).json({success:true, message:'Address is updated successfuly'});
        }).catch(err=>{
                res.status(400).json({success:false, message:err.message});
            })


    }catch (e) {
        res.status(500).json({success:false, message:e.message});
    }
}

