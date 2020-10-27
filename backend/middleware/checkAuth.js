const jwt = require('jsonwebtoken');

module.exports =  (req, res)=>{

     try{
         const token = req.headers.authorization.split(' ')[1]; //Bearer token

         if(!token){
             return req.user = null;
         }

         const decoded = jwt.verify(token, process.env.PASSWORD, (err, result)=> {
             return{err: err, result: result};
         });

         if(decoded.err){
             return req.user = null;
         }

         req.user = decoded.result;

     }catch(e){

         res.status(401).json({message: e.message});
     }
}

