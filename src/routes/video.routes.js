import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, updateVideo, uploadVideo } from "../controllers/video.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/upload-video").post(
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
)
router.route("/get-all-videos").get(getAllVideos)
router.route("/get-video").get(getVideoById)
router.route("/update-video-details").patch(
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    updateVideo
)
router.route("/delete-video").delete(deleteVideo)

export default router