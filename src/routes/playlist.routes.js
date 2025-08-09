import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, getPlaylistById, getUserPlaylists } from "../controllers/playlist.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/create-playlist").post(createPlaylist)
router.route("/get-playlists").get(getUserPlaylists)
router.route("/get-playlist").get(getPlaylistById)
router.route("/add-video").patch(addVideoToPlaylist)

export default router