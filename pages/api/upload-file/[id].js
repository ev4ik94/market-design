const File  =require('../../../backend/controllers/file.controller');

export const config = {
    api: {
        bodyParser: false,
    },
};


export default async (req, res)=>{

    const {method} = req

    switch(method){

        case 'GET':

            await File.getFiles(req,res)
            break

        case 'POST':

            await File.fileUpload(req,res)
            break

        default:
            res.status(400).json({success: false})
            break
    }
}
