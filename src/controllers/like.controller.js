import {Like} from "../models/like.model.js"
import {apiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.query
    const user = req.user;
    if(!videoId) throw new apiError(404,"Video Id not found");
    if(!user) throw new apiError(404,"user not found");

    const like = await Like.findOneAndDelete({
        video: videoId,
        likedBy: user
    })
    if(like) return res.status(200).json(new apiResponse(200,like,"video unliked successfully"));

    const likeVideo = await Like.create({
        video: videoId,
        likedBy: user
    })
    if(!likeVideo) throw new apiError(404,"videoId not found or user not found");

    return res.status(200)
    .json(new apiResponse(
        200,
        likeVideo,
        "video liked successfully"
    ))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.query
    const user = req.user;
    if(!commentId) throw new apiError(404,"comment id not found");
    if(!user) throw new apiError(404,"user not found");

    const like = await Like.findOneAndDelete({
        comment: commentId,
        likedBy: user
    })
    if(like) return res.status(200).json(new apiResponse(200,like,"comment unliked successfully"));

    const likeComment = await Like.create({
        comment: commentId,
        likedBy: user
    })
    if(!likeComment) throw new apiError(404,"comment id not found or user not found");

    return res.status(200)
    .json(new apiResponse(
        200,
        likeComment,
        "comment liked successfully"
    ))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.query
    const user = req.user;
    if(!tweetId) throw new apiError(404,"tweet id not found");
    if(!user) throw new apiError(404,"user not found");

    const tweet = await Like.findOneAndDelete({
        tweet: tweetId,
        likedBy: user
    })
    if(tweet) return res.status(200).json(new apiResponse(200,tweet,"tweet unliked successfully"));

    const liketweet = await Like.create({
        tweet: tweetId,
        likedBy: user
    })
    if(!liketweet) throw new apiError(404,"tweet id not found or user not found");

    return res.status(200)
    .json(new apiResponse(
        200,
        liketweet,
        "tweet liked successfully"
    ))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.findOne({likedBy : req.user})
    return res.status(200)
    .json(new apiResponse(
        200,
        likedVideos,
        "All liked videos fetch successfully"
    ))
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}