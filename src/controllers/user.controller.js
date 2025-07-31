import {asyncHandler} from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import  jwt  from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken};
    }
    catch(error){
        throw new apiError(500,"Error while generating access and refresh token");
    }
}

const registerUser = asyncHandler( async (req,res) => {
    const { fullname , username , email, password } = req.body;
    if([fullname,username,email,password].some((field) => field?.trim() === "")) 
        throw new apiError(400,"Not enough data to register user");

    console.log(req.body)

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existedUser) throw new apiError(409,`User with ${username} or ${email} already exist`);

    const coverImageLocalPath =
    req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0
        ? req.files.coverImage[0].path : null;

    const avatarLocalPath = req.files?.avatar[0]?.path
    if(!avatarLocalPath) throw new apiError(400,"Avatar file is required");
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar) throw new apiError(400,"Error while uploading avatar to server");

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) throw new apiError(500,"Server is not successfull to register user")

    return res.status(201).json(
        new apiResponse(201,createdUser,"User register successfully")
    )
})

const loginUser = asyncHandler( async (req,res) =>{
    const {username , email , password} = req.body
    if(!email && !username) throw new apiError(400,"username or email is required");
    if(!password) throw new apiError(400,"Password is required");

    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user) throw new apiError(404,"User does not exist");

    const validPassword = await user.isPasswordCorrect(password);
    if(!validPassword) throw new apiError(401,"Incorrect Password");

    const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
            user: loggedInUser, accessToken, refreshToken
            },
            "User loggedIn successfully"
        )
    )
})

const logoutUser = asyncHandler( async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new apiResponse(200,{},"User loggedOut successfully"))
})

const refreshAccessToken = asyncHandler( async (req,res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken) throw new apiError(401,"Unauthorized request");
    
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECERT);
    
        const user = await User.findById(decodedToken._id)
        if(!user) throw new apiError(401,"Invalid refresh token");
    
        if(user.refreshToken !== incomingRefreshToken) throw new apiError(401,"Refresh token expired");
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {newaccessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken",newaccessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new apiResponse(
                200,
                {newaccessToken,newrefreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new apiError(500,error?.message || "Error while generating new access token");
    }
})

const changeCurrentPassword = asyncHandler( async (req,res) => {
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword) throw new apiError(400,"old and new password required");

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect) throw new apiError(400,"Invalid old password");

    user.password = newPassword;
    await user.save({validateBeforeSave:false})

    return res.status(200).json(
        new apiResponse(
            200,
            {},
            "Password Changed Successfully"
        )
    )
})

const getCurrentUser = asyncHandler( async (req,res) => {
    return res.status(200)
    .json(200,req.user,"Current user fetch successfully")
})

const updateAccountDetails = asyncHandler( async (req,res) => {
    const {fullname , email} = req.body;
    if(!fullname || !email) throw new apiError(400,"fullname and email required");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        {new : true}
    ).select("-password")
    
    return res.status(200)
    .json(new apiResponse(400,user,"Account details update successfully"))
})

const updateUserAvatar = asyncHandler( async (req,res) => {
    const avatarlocalpath = req.file?.path
    if(!avatarlocalpath) throw new apiError(400,"Avatar file is missing");

    const avatar = await uploadOnCloudinary(avatarlocalpath)
    if(!avatar) throw new apiError(500,"Error while uploading on avatar");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200)
    .json(new apiResponse(200,user,"Avatar update successfully"))
})

const updateUserCoverImage = asyncHandler( async (req,res) => {
    const coverImagelocalpath = req.file?.path
    if(!coverImagelocalpath) throw new apiError(400,"Cover image file is missing");

    const coverImage = await uploadOnCloudinary(coverImagelocalpath)
    if(!coverImage) throw new apiError(500,"Error while uploading on cover image");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200)
    .json(new apiResponse(200,user,"Avatar update successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}

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

/*
1. Check all required data is present or not.
2. Find username or email.
3. Validate user exist or not.
4. Check for password.
5. Generate access token and refresh token.
6. Send cookies
*/