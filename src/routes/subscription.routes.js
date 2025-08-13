import { Router } from "express";
import { getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/toggle-subscription").post(toggleSubscription)
router.route("/get-subscribers").get(getUserChannelSubscribers)

export default router