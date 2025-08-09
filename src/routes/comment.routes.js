import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/get-all-comments").get(getAllVideoComments)
router.route("/add-comment").post(addComment)
router.route("/update-comment").patch(updateComment)
router.route("/delete-comment").delete(deleteComment)

export default router