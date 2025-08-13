import mongoose from "mongoose"
import { Subscription } from "../models/subscriptions.model.js"
import {apiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        const {channelId} = req.query
        const userId = req.user?._id
        if(!channelId) throw new apiError(404,"channel not found");
        if(!userId) throw new apiError(404,"user not found");
    
        const subscribe = await Subscription.findOneAndDelete({
            Subscriber: userId,
            channel: channelId
        })
        if(subscribe) return res.status(200).json(new apiResponse(200,subscribe,"unsubscribed successfully"));
    
        const subscribeChannel = await Subscription.create({
            Subscriber: userId,
            channel: channelId
        })
        if(!subscribeChannel) throw new apiError(400,"wrong userId or channelId");
    
        return res.status(200)
        .json(new apiResponse(
            200,
            subscribeChannel,
            "subscribed successfully"
        ))
    } catch (error) {
        throw new apiError(500,error.message || "error while toggle subscription")
    }
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    try {
        const {channelId} = req.query
        if(!channelId) throw new apiError(404,"channel not found");

        const allSubscribers = await Subscription.aggregate([
            {
                $match: { channel : new mongoose.Types.ObjectId(channelId) }
            },
            {
                $project: {
                    _id: 0,
                    subscriber: "$Subscriber"
                }
            },
            {
                $group: {
                    _id: null,
                    subscribers: { $addToSet : "$subscriber"}
                }
            }
        ])
        if(!allSubscribers) throw new apiError(404,"worng channel id");

        return res.status(200)
        .json(new apiResponse(
            200,
            allSubscribers,
            "all subscribers fetch successfully"
        ))
    } catch (error) {
        throw new apiError(500,error.message || "error while get channel subscribers")
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers
}