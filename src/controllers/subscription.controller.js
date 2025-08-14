import mongoose from "mongoose"
import { Subscription } from "../models/subscriptions.model.js"
import {apiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { getAllSubscribers } from "../services/subscribers.service.js"

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

        const allSubscribers = await getAllSubscribers(channelId);

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

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId  = req.user?._id
    if(!subscriberId) throw new apiError(404,"user not found");

    const allsubscribedchannels = await Subscription.aggregate([
        {
            $match: { Subscriber: new mongoose.Types.ObjectId(subscriberId) }
        },
        {
            $project: {
                _id: 0,
                allchannels : "$channel"
            }
        },
        {
            $group: {
                _id: null,
                channels : { $addToSet : "$allchannels"}
            }
        }
    ])
    if(!allsubscribedchannels) throw new apiError(400,"wrong user");

    return res.status(200)
    .json(new apiResponse(
        200,
        allsubscribedchannels,
        "all subscribed channels fetch successfully"
    ))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}