import mongoose from "mongoose"
import { Like } from "../models/like.model.js"
import { apiError } from "../utils/ApiError.js"

const getAllLikes = async (userId) => {
    const totalLikes = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData"
            }
        },
        {
            $unwind: "$videoData"
        },
        {
            $match : {
                'videoData.owner' : new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    if(!totalLikes) throw new apiError(400,"invalid user id");

    return totalLikes
}

export { 
    getAllLikes
}