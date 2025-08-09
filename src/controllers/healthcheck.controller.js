import { apiError } from "../utils/ApiError.js"
import { apiResponse } from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    try {
        return res.status(200)
        .json(new apiResponse(
            200,
            {
                health: "Ok"
            },
            "Everything is fine"
        ))
    } catch (error) {
        throw new apiError(500,error.message || "health is not ok")
    }
})

export {healthcheck}