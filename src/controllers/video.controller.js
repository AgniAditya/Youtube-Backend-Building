import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler( async (req,res) => {
    const {title , description} = req.body
    const videofilepath = req.files?.video[0].path
    const thumbnailpath = req.files?.thumbnail[0].path
    const owner = req.user

    if(!title || !description) throw new apiError(400,"title or description is required");
    if(!videofilepath) throw new apiError(400,"video is required");
    if(!thumbnailpath) throw new apiError(400,"thumbnail is required");
    if(!owner) throw new apiError(400,"not valid user");

    const videofile = await uploadOnCloudinary(videofilepath)
    if(!videofile) throw new apiError(500,"can not upload video");
 
    const thumbnail = await uploadOnCloudinary(thumbnailpath)
    if(!thumbnail) throw new apiError(500,"can not upload thumbnail");

    const video = await Video.create({
        videofile: videofile.url,
        thumbnail: thumbnail.url,
        title: title,
        description: description,
        duration: videofile.duration,
        owner: owner
    })

    if(!video) throw new apiError(500,"unable to upload video to database");

    return res.status(200)
    .json(new apiResponse(
        200,
        video,
        "Video uploaded successfully"
    ))
})

export {
    uploadVideo
}