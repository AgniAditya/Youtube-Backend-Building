import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler( async (req,res) => {
    const { fullname , username , email, password } = req.body;
    if([fullname,username,email,password].some((field) => field?.trim() === "")) 
        throw new apiError(400,"Not enough data to register user");

    console.log(req.body)

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser) throw new apiError(409,`User with ${username} or ${email} already exist`);

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath) throw new apiError(400,"Avatar file is required");

   const avatar =  await uploadOnCloudinary(avatarLocalPath)
   const coverImage =  await uploadOnCloudinary(avatarLocalPath)
   if(!avatar) throw new apiError(400,"Error while uploading avatar to server");

    await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) throw new apiError(500,"Server is not successfull to register user")

    return res.status(201).json(
        new apiResponse(201,createdUser,"User register successfully")
    )
})

export {registerUser}

/*
Steps to register user : 
1. Check all required data is present or not.
2. Check user already exist or not. (username and email)
3. Check for images , check for avatar
4. uplaod them to cloudinary
5. create user object.
6. romove password and refresh token field from response.
7. check for user creation.
8. return response.
*/