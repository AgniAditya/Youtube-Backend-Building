import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECERT
});

const uploadOnCloudinary = async (localfilepath) => {
    try{
        if(!localfilepath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type : 'auto'
        })
        console.log(`File is uploaded on cloudinary: ${response.url}`)
        fs.unlinkSync(localfilepath)
        return response
    }
    catch (error){
        console.log('Error while uploading files to cloudinary',error)
        fs.unlinkSync(localfilepath)
        return null
    }
}

const destroyOldImageFromCloudinary = async (oldfilepath) => {
    try{
        if(!oldfilepath) return null;
        //Destroy the file from cloudinary
        const response = await cloudinary.uploader.destroy(oldfilepath,{
            resource_type : 'auto'
        });
        return response;
    }
    catch (error) {
        console.log('Error while deleting file from cloudinary',error)
        return null
    }
}

export {uploadOnCloudinary,destroyOldImageFromCloudinary}