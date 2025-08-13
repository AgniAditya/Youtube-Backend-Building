import { Router } from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/toggle-subscription").post(toggleSubscription)
router.route("/get-subscribers").get(getUserChannelSubscribers)
router.route("/get-subscribed-channel").get(getSubscribedChannels)

export default router