import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideoComments } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/get-all-comments").get(getAllVideoComments)

export default router