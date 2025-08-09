import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/create-playlist").post(createPlaylist)
router.route("/get-playlists").get(getUserPlaylists)
router.route("/get-playlist").get(getPlaylistById)
router.route("/add-video").patch(addVideoToPlaylist)
router.route("/remove-video").patch(removeVideoFromPlaylist)
router.route("/update-playlist").patch(updatePlaylist)
router.route("/delete-playlist").delete(deletePlaylist)

export default router