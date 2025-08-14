import mongoose from "mongoose"
import { Subscription } from "../models/subscriptions.model.js"
import {apiError} from "../utils/ApiError.js"

const getAllSubscribers = async (channelId) => {
    try {
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
    
        return allSubscribers
    } catch (error) {
        throw new apiError(500,error.message || "not able to get all the subscribers")
    }
}

export {
    getAllSubscribers
}