
const db = require('../../../backend/utils/db.config');
const UserModel = db.user;
const ResetToken = db.resetPassword;
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize-next');
const Op = Sequelize.Op;



export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':
            try{

                await ResetToken.destroy({
                    where: {
                        expiration: { [Op.lt]: Date.now()}
                    }
                });

                let record = await ResetToken.findOne({
                    where: {
                        expiration: { [Op.gt]: Date.now()},
                        token: req.query.token,
                        used: 0
                    }
                });

                if (record == null) {
                    return res.json({
                        message: 'Token has expired. Please try password reset again.',
                        showForm: false
                    });
                }

                res.json({
                    showForm: true,
                    record: record
                });

            }catch(e){
                console.log(e.message)
                return res.status(400).json({message:false})
            }
            break;
        case 'POST':
            try {

                if (req.body.password1 !== req.body.password2) {
                    return res.status(400).json({status: 'error', message: 'Passwords do not match. Please try again.'});
                }

                let record = await ResetToken.findOne({
                    where: {
                        email: req.body.email,
                        expiration: { [Op.gt]: Date.now()},
                        token: req.body.token,
                        used: 0
                    }
                });



                if (record == null) {
                    return res.status(400).json({status: 'error', message: 'Token not found. Please try the reset password process again.'});
                }

                await ResetToken.update({
                        used: 1
                    },
                    {
                        where: {
                            email: req.body.email
                        }
                    });


                let newPassword = await bcrypt.hash(req.body.password1, 12);

                await UserModel.update({
                        password: newPassword
                    },
                    {
                        where: {
                            email: req.body.email
                        }
                    }).then(result=>{
                    return res.status(200).json({success: true});
                }).catch(err=>{
                    return res.status(400).json({success: false, message:err.message});
                })




            }catch(e){
                res.status(400).json({success: false, message: e.message})
            }
            break

        default:
            res.status(400).json({success: false})
            break
    }
}

