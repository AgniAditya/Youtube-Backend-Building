import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos, uploadVideo } from "../controllers/video.controller.js";

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

export default router