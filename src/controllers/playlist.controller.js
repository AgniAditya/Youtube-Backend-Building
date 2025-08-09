import mongoose from "mongoose"
import {PlayList} from "../models/playlist.model.js"
import {apiError} from "../utils/ApiError.js"
import {apiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description = ''} = req.body
    if(!name) throw new apiError(404,"name is required");
    
    const playlist = await PlayList.create({
        name: name,
        description: description,
        owner: req.user
    })
    if(!playlist) throw new apiError(400,"user is not valid");

    return res.status(200)
    .json(new apiResponse(
        200,
        playlist,
        "playlist created successfully"
    ))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.query
    if(!userId) throw new apiError(404,"user id not found");

    const playlists = await PlayList.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        }
    ])
    if(!playlists) throw new apiError(400,"wrong user id");

    return res.status(200)
    .json(new apiResponse(
        200,
        playlists,
        "all user playlist fetch successfully"
    ))
})

export {
    createPlaylist,
    getUserPlaylists,
}