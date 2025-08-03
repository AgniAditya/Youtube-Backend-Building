import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    }
},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)