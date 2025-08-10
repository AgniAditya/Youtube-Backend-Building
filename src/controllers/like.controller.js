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

export {
    toggleVideoLike,
}