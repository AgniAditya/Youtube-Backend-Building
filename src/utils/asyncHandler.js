// Define a function that takes an Express route handler as input
const asyncHandler = (requestHandler) => {

    // Define a new middleware function that Express can use
    // It takes req, res, and next just like any normal route handler
    return (req, res, next) => {

        // Wrap the route handler in Promise.resolve()
        // This ensures that even non-Promise values are handled as Promises
        // If requestHandler throws or returns a rejected Promise, catch it and pass the error to Express
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }

}

// Export the asyncHandler function for use in route files
export { asyncHandler }