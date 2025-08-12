import {Tweet} from "../models/tweet.model.js"
import {apiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content) throw new apiError(404,"tweet not found");

    const tweet = await Tweet.create({
        content: content,
        owner: req.user
    })
    if(!tweet) throw new apiError(400,"not a valid user");

    return res.status(200)
    .json(new apiResponse(
        200,
        tweet,
        "tweet is created successfully"
    ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id
    if(!ownerId) throw new apiError(404,"user not found");

    const usertweets = await Tweet.findOne({ owner: ownerId})
    if(!usertweets) throw new apiError(400,"wrong user request");

    return res.status(200)
    .json(new apiResponse(
        200,
        usertweets,
        "all tweets by the user is fetch successfully"
    ))
})

export {
    createTweet,
    getUserTweets
}