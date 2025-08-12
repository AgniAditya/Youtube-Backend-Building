import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweets } from "../controllers/tweet.controller.js";

const router = Router()
router.use(verifyJWT)

router.route("/create-tweet").post(createTweet)
router.route("/get-tweets").get(getUserTweets)

export default router