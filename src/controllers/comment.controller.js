import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"

const getAllVideoComments = asyncHandler( async (req,res) => {
    const {videoId} = req.params
    if(!videoId) throw new apiError(404,"Not valid video");

    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const comments = await Comment.aggregate([
        {
            $match: {
                video : mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                owner : { $arrayElemAt : ["$ownerDetails",0] }
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])

    const totalComments = await Comment.countDocuments({
        $match: {
            video : mongoose.Types.ObjectId(videoId)
        }
    })

    return res.status(200)
    .json(new apiResponse(
        200,
        comments,
        "All comments fetch successfully"
    ))
})

export {
    getAllVideoComments
}