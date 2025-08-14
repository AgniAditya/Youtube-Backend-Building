import {apiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { getAllSubscribers } from "../services/subscribers.service.js"
import { getAllUserVideos, getAllVideoViews } from "../services/video.service.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const user = req.user?._id
    if(!user) throw new apiError(404,"user not found");

    const totalSubscribers = await getAllSubscribers(user)
    const totalVideos = await getAllUserVideos(user)
    const totalViwes = await getAllVideoViews(user)
    // const totalLikes = await getAllLikes(user)

    if( !(totalSubscribers || totalVideos || totalViwes) )
        throw new apiError(400,"invalid user id");

    const stats = [
        {
            Subscribers : totalSubscribers.length
        },
        {
            Videos : totalVideos.length
        },
        {
            Views : totalViwes.length
        }
    ]

    return res.status(200)
    .json(new apiResponse(
        200,
        stats,
        "all stats fetch successfully"
    ))
})

export {
    getChannelStats
}