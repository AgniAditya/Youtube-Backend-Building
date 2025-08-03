import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, getAllVideoComments } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/get-all-comments").get(getAllVideoComments)
router.route("/add-comment").post(addComment)

export default router