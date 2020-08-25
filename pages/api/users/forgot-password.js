const userWork = require('../../../controllers/user.controller');
const db = require('../../../utils/db.config');
const UserModel = db.user;
const ResetToken = db.resetPassword;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const validator = require('validator');


export default async (req, res)=>{

    const {method} = req

    switch(method){
        case 'POST':
            try {


                if(!validator.isEmail(validator.escape(req.body.email))) {
                    return res.status(400).json({success: false, message: 'Invalid email'});
                }

                const transport = nodemailer.createTransport({
                    host: process.env.MAILER_HOST,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.MAILER_USER,
                        pass: process.env.MAILER_PASSWORD
                    }
                });

                let email = await UserModel.findOne({where: { email: req.body.email }});

                if (email == null) {
                    return res.status(200).json({message: 'success'})
                }

                await ResetToken.update({
                        used: 1
                    },
                    {
                        where: {
                            email: req.body.email
                        }
                    });

                let fpSalt = crypto.randomBytes(10).toString('base64');
                let token = jwt.sign({
                    email: req.body.email,
                    created_at: Date.now()
                }, fpSalt, {expiresIn: '1h'});

                let expireDate = Date.now() + 3600000;


                await ResetToken.create({
                    email: req.body.email,
                    expiration: expireDate,
                    token,
                    used: 0
                });

                const message = {
                    from: 'info@ethereal.email',
                    to: req.body.email,
                    replyTo: 'process.env.REPLYTO_ADDRESS',
                    subject: `Change of login information for user ${req.body.email} on the site "tralala.com"`,
                    html: `The site <a href=${process.env.API_URL}>trololo.com</a> 
                    has received a request to reset the password for your account. 
                    To reset your password, please click the link below.
                    <br><a href=${process.env.API_URL}/user/changePassword/${token}>
                    ${process.env.API_URL}/user/changePassword/${token}</a>`
                };

                transport.sendMail(message, function (err, info) {
                    if(err) { return res.status(400).json({success: false, message: err.message})}
                    else { return res.status(200).json({success: true, data:info});}
                });



            }catch(e){
                res.status(400).json({success: false, message: e.message})
            }
            break

        default:
            res.status(400).json({success: false})
            break
    }
}

