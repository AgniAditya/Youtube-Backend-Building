import { Video } from "../models/video.model.js";
import { apiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const getAllUserVideos = async (userId,page = 1,limit = 10) => {
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
    if(!videos) throw new apiError(400,"invalid user id");

    return videos
}

const getAllVideoViews = async (userId) => {
    const totalViews = await Video.aggregate([
        {
            $match: { 
                owner : new  mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalviews : { $sum : "$views" }
            }
        }
    ])
    if(!totalViews) throw new apiError(400,"invalid user id");

    return totalViews
}

export {
    getAllUserVideos,
    getAllVideoViews
}