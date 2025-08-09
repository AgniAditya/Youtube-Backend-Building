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

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.query
    if(!playlistId) throw new apiError(404,"playlist id not found");

    const playlist = await PlayList.findById(playlistId)
    if(!playlist) throw new apiError(400,"wrong playlist id");

    return res.status(200)
    .json(new apiResponse(
        200,
        playlist,
        "playlist fetch successfully"
    ))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.query
    if(!playlistId || !videoId) throw new apiError(404,"playlist id or video id is not found");

    const addtoplaylist = await PlayList.updateOne(
        {
            _id: playlistId
        },
        {
            $addToSet: {videos: videoId}
        },
    )
    if(!addtoplaylist) throw new apiError(400,"playlist id or video id is wrong");
    console.log(addtoplaylist)

    return res.status(200)
    .json(new apiResponse(
        200,
        addtoplaylist,
        "video successfully added to playlist"
    ))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.query
    if(!playlistId || !videoId) throw new apiError(404,"playlist id or video id is not found");

    const deletevideo = await PlayList.updateOne(
        {
            _id: playlistId
        },
        {
            $pull: {videos: videoId}
        },
    )
    if(!deletevideo) throw new apiError(400,"playlist id or video id is wrong");

    return res.status(200)
    .json(new apiResponse(
        200,
        deletevideo,
        "video successfully deleted from playlist"
    ))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.query
    const {name, description} = req.body
    if(!playlistId) throw new apiError(404,"playlist id not found");

    const updatePlaylist = await PlayList.updateOne(
        {
            _id: playlistId
        },
        {
            $set: {
                name: name,
                description: description
            }   
        }
    )
    if(!playlistId) throw new apiError(400,"wrong playlist id");

    return res.status(200)
    .json(new apiResponse(
        200,
        updatePlaylist,
        "playlist is updated successfully"
    ))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.query
    if(!playlistId) throw new apiError(404,"playlist id not found");

    const deletePlaylist = await PlayList.deleteOne({ _id : playlistId })
    if(!deletePlaylist) throw new apiError(400,"wrong playlist id");

    return res.status(200)
    .json(new apiResponse(
        200,
        deletePlaylist,
        "playlist deleted successfully"
    ))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
}