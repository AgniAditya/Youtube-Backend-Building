import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : '20kb'}))
app.use(express.urlencoded({extended:true,limit:'20kb'}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes import
import userRouter from './routes/user.routes.js';
import commentRouter from './routes/comment.routes.js';
import videoRouter from './routes/video.routes.js';
import healthCheckerRouter from './routes/healthcheck.routes.js';
import playlistRouter from './routes/playlist.routes.js';

//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1",healthCheckerRouter)
app.use("/api/v1/playlist",playlistRouter)

export {app}