import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { destroyOldMediaFileFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

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
        videofile_public_id: videofile.public_id,
        thumbnail: thumbnail.url,
        thumbnail_public_id: thumbnail.public_id,
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

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user?._id
    if(!userId) throw new apiError(404,"user not found");

    const skip = (page - 1) * limit

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])

    return res.status(200)
    .json(new apiResponse(
        200,
        videos,
        "all video fetched successfully"
    ))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.query
    if(!videoId) throw new apiError(404,"video id is required");

    const video = await Video.findById(videoId)
    if(!video) throw new apiError(404,"video not found");

    return res.status(200)
    .json(new apiResponse(
        200,
        video,
        "video fetch successfully"
    ))
})

const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.query
        const newtitle = req.body?.newtitle;
        const newdescription = req.body?.newdescription;
        const newthumbnail = req.files?.thumbnail?.[0]?.path;
        
        if(!videoId) throw new apiError(404,"video id not found")
            
        const updateValues = {}
        if(newtitle) updateValues.title = newtitle;
        if(newdescription) updateValues.description = newdescription;
        if(newthumbnail) {
            const thumbnail = await uploadOnCloudinary(newthumbnail)
            if(!thumbnail) new apiError(500,"can not able to update thumbnail");
            updateValues.thumbnail = thumbnail.url
            updateValues.thumbnail_public_id = thumbnail.public_id
    
            const oldThumbnail = (await Video.findById(videoId)).thumbnail_public_id
            if(oldThumbnail){
                const destroyed = await destroyOldMediaFileFromCloudinary(oldThumbnail)
                if(destroyed) console.log("old image deleted successfully")
            }
        }
    
        const video = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: updateValues
            },
            {
                new: true,
                runValidators: true
            }
        )
    
        if(!video) new apiError(500,"unable to update video details");
    
        return res.status(200)
        .json(new apiResponse(
            200,
            video,
            "video details updated successfully"
        ))
    } catch (error) {
        console.log(error)
    }
})

const deleteVideo = asyncHandler(async (req,res) => {
    const { videoId } = req.query
    if(!videoId) throw new apiError(404,"video id not found");

    const video = await Video.findById(videoId)
    const videofile = video.videofile_public_id
    const thumbnail = video.thumbnail_public_id

    if(!videofile || !thumbnail) throw new apiError(500,"unable to find media files");

    const destroyVideoFile = await destroyOldMediaFileFromCloudinary(videofile,'video')
    const destroyThumbnail = await destroyOldMediaFileFromCloudinary(thumbnail,'image')

    if(!destroyThumbnail || !destroyVideoFile) throw new apiError(500,"unable to delete media files");

    const deleteVideo = await Video.findByIdAndDelete(videoId)
    if(!deleteVideo) throw new apiError(500,"unable to delete video");

    return res.status(200)
    .json(new apiResponse(
        200,
        deleteVideo,
        "video delete successfully"
    ))
})

export {
    uploadVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo
}