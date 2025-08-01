### Building Backend for Youtube

A backend API for a YouTube-like platform, built with Node.js, Express, and MongoDB. This project handles user authentication, video uploads, subscriptions, and more, following modern backend best practices.

## Features

- **User Authentication:** Register, login, logout, and refresh tokens using JWT.
- **User Management:** Update profile, change password, upload avatar and cover images.
- **Video Management:** Upload videos and thumbnails, track views, and manage publishing status.
- **Subscriptions:** Subscribe/unsubscribe to channels.
- **File Uploads:** Uses Multer for handling file uploads and Cloudinary for cloud storage.
- **API Responses:** Consistent API response and error handling structure.
- **Security:** Uses HTTP-only cookies for tokens, bcrypt for password hashing, and CORS configuration.

## Project Structure

```
public
├── temp
src
├── controllers
│   ├── authController.js
│   ├── userController.js
│   ├── videoController.js
│   └── subscriptionController.js
├── middlewares
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
├── models
│   ├── UserModel.js
│   ├── VideoModel.js
│   └── SubscriptionModel.js
├── routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── videoRoutes.js
│   └── subscriptionRoutes.js
├── utils
│   ├── apiError.js
|   ├── apiResponse.js
│   └── asyncHandler.js
│   ├── cloudinary.js
|-- constants.js
├── app.js
├── index.js
.env
.gitignore
package.json
package-lock.json
.prettierrc
.prettierignore
README.md
```

## public/temp Directory

The `public/temp` directory is used as a temporary storage location for files uploaded by users. When a user uploads a video or image, the file is first saved in this folder (typically by the Multer middleware). After the file is processed—such as being uploaded to a cloud storage service like Cloudinary—it is removed from `public/temp` to conserve space.

**Summary:**  
`public/temp` acts as a staging area for temporary files during the upload and processing workflow.

## Technologies Used

- **Node.js** & **Express**: Server and routing framework
- **MongoDB** & **Mongoose**: Database and ODM
- **JWT (jsonwebtoken)**: Authentication tokens
- **bcrypt**: Password hashing
- **multer**: File uploads
- **cloudinary**: Cloud file storage
- **cookie-parser**: Cookie handling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **mongoose-aggregate-paginate-v2**: Pagination for MongoDB aggregations
- **Prettier**: Code formatting (dev)
- **nodemon**: Development server auto-reload (dev)

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
    MONGODB_URI=<fill-your-api>
    PORT=<fill-your-port>
    CORS_ORIGIN=<fill-your-origin>
    ACCESS_TOKEN_SECERT=<fill-your-secret>
    ACCESS_TOKEN_EXPIRY=<fill-your-expiry>
    REFRESH_TOKEN_SECERT=<fill-your-secret>
    REFRESH_TOKEN_EXPIRY=<fill-your-expiry>
    CLOUDINARY_CLOUD_NAME=<fill-your-cloud-name>
    CLOUDINARY_API_KEY=<fill-your-api-key>
    CLOUDINARY_API_SECERT=<fill-your-api-secret>
    CLOUDINARY_URL=<fill-your-cloudinary-url>
   ```
4. **Development mode**
   For development, use nodemon to auto-reload on changes:
   ```sh
   npm run dev
   ```
5. **API available at:** http://localhost:PORT/api/v1/


## Scripts
- `npm run dev`: Start the server in development mode with nodemon.

## Author
Aditya Agnihotri

```
This project is for educational purposes and demonstrates a scalable backend architecture for a video-sharing platform.
```