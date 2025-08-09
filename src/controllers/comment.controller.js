import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import { Video } from "../models/video.model.js";

const getAllVideoComments = asyncHandler( async (req,res) => {
    const {videoId} = req.query
    if(!videoId) throw new apiError(404,"Not valid video");

    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const comments = await Comment.aggregate([
        {
            $match: {
                video : new mongoose.Types.ObjectId(videoId)
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

    return res.status(200)
    .json(new apiResponse(
        200,
        comments,
        "All comments fetch successfully"
    ))
})

const addComment = asyncHandler( async (req,res) => {
    const {comment} = req.body
    if(!comment) throw apiError(400,"Comment required");

    const {videoId} = req.query
    if(!videoId) throw new apiError(400,"video required");

    const video = await Video.findById(videoId)
    if(!video) throw new apiError(404,"video not found");

    const videoComment = await Comment.create({
        content: comment,
        video: video,
        owner: req.user
    })

    if(!videoComment) throw new apiError(500,"Comment not added");

    return res.status(200)
    .json(new apiResponse(
        200,
        videoComment,
        "Comment successfully added"
    ))
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.query
    const {content} = req.body
    if(!commentId || !content) throw new apiError(404,"Content or comment id not found");

    const comment = await Comment.findById(commentId)
    const session = await mongoose.startSession()

    try {
        await session.withTransaction(async () => {
            comment.content = content
            await comment.save({validateBeforeSave : false})
        })
    } catch (error) {
        throw new apiError(400,error.message || "failed to update comment")
    }
    finally{
        session.endSession()
    }

    return res.status(200)
    .json(new apiResponse(
        200,
        comment,
        "comment updated successfully"
    ))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.query
    if(!commentId) throw new apiError(404,"comment id not found");

    const deletedComment = await Comment.deleteOne({ _id: commentId })
    if(!deletedComment) throw new apiError(400,"comment id does not exist");

    return res.status(200)
    .json(new apiResponse(
        200,
        deletedComment,
        "comment deleted successfully"
    ))
})

export {
    getAllVideoComments,
    addComment,
    updateComment,
    deleteComment
}