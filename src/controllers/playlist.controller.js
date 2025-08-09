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


export {
    createPlaylist,
}