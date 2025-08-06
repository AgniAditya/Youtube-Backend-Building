### 📺 YouTube Backend Clone

A scalable backend API for a YouTube-like platform built with Node.js, Express, and MongoDB. It supports user authentication, video management, subscriptions, and more—following modern best practices for backend development.

## 🚀 Features

- **Authentication**  
  Register, login, logout, and refresh tokens using **JWT** and secure **HTTP-only cookies**.

- **User Management**  
  Update profile, change password, upload avatar and cover images.

- **Video Management**  
  Upload videos and thumbnails, manage views and publishing status.

- **Subscriptions**  
  Subscribe/unsubscribe to other users' channels.

- **File Uploads**  
  File handling with **Multer**, storage with **Cloudinary**.

- **API Structure**  
  Consistent response and error formats using helper utilities.

- **Security**  
  Secure password hashing with **bcrypt**, CORS configuration, and environment-based variables.

## Project Structure

```
public/
├── temp/                      # Temporary file storage
src/
├── controllers/              # Business logic for each route
|   └── commentController.js
|   └── dashboardController.js
|   └── healthcheckController.js
|   └── likeController.js
|   └── playlistController.js
|   └── subscriptionController.js
|   └── tweetController.js
│   └── userController.js
|   └── videoController.js
├── db/
│   └── index.js              # MongoDB connection setup
├── middlewares/             # Custom middleware
│   └── authMiddleware.js
│   └── multerMiddleware.js
├── models/                  # Mongoose schemas
│   └── commentModel.js
│   └── likeModel.js
│   └── playlistModel.js
│   └── subscriptionModel.js
│   └── tweetModel.js
│   └── userModel.js
│   └── videoModel.js
├── routes/                  # Express routes
│   └── commentRoutes.js
│   └── dashboardRoutes.js
│   └── healthcheckRoutes.js
│   └── likeRoutes.js
│   └── playlistRoutes.js
│   └── subscriptionRoutes.js
│   └── tweetRoutes.js
│   └── userRoutes.js
├── utils/                   # Utility functions
│   └── apiError.js
|   └── apiResponse.js
│   └── asyncHandler.js
│   └── cloudinary.js
├── constants.js             # Constant values
├── app.js                   # Express app setup
├── index.js                 # Entry point
.env
.env.example
.gitignore
package.json
package-lock.json
.prettierrc
.prettierignore
README.md
```

## 📁 public/temp Directory

The `public/temp` directory is used as a **temporary staging area** for uploaded files.  
When users upload videos or images:

1. Files are saved to `public/temp` via **Multer**.
2. Uploaded to **Cloudinary**.
3. Removed from local storage afterward.

## 🛠 Technologies Used

| Technology                    | Purpose                              |
|------------------------------|--------------------------------------|
| Node.js & Express            | Backend framework                    |
| MongoDB & Mongoose           | Database and ODM                     |
| JWT & cookie-parser          | Auth and session management          |
| bcrypt                       | Password encryption                  |
| multer                       | File upload handling                 |
| cloudinary                   | Cloud storage for media              |
| cors                         | Cross-origin resource sharing        |
| dotenv                       | Environment variable management      |
| mongoose-aggregate-paginate-v2 | MongoDB aggregation pagination   |
| Prettier                     | Code formatting (dev only)           |
| nodemon                      | Auto-reload server (dev only)        |

## 🧪 API Testing

All API endpoints were tested using Postman, a powerful tool for designing, testing, and documenting RESTful APIs.
You can import a collection and environment (optional) to make testing easier and faster.

## ⚙️ Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/AgniAditya/Youtube-Backend-Building.git
   cd Youtube-Backend-Building
   ```
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
4. **Start Development Server**
   ```sh
   npm run dev
   ```
5. **API available at:** 
   ```sh
   http://localhost:<PORT>
   ```


## Scripts
- `npm run dev`: Start the server in development mode with nodemon.

## Author
Aditya Agnihotri

```
This project is for educational purposes and demonstrates a scalable backend architecture for a video-sharing platform.
```