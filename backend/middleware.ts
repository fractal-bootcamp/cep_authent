import type { NextFunction, Request, RequestHandler, Response } from "express";
import { verify } from "jsonwebtoken";


// exporting this variable makes AUTH_SECRET available for import in other files 
export const AUTH_SECRET = process.env.AUTH_SECRET || "MY_SECRET"; // if an environment variable named AUTH_SECRET exists -> its value will be used ---> if left side is false, will use MY_SECRET 
// process.env for managing configuration & secrets (keeps sensitive data out of code repo - easy configuration changes - seperating config from code)
// ? here AUTH_SECRET = MY_SECRET in .env file ? 


// check if the user making a request is authenticated by -> looking for a token in the RequestHandler 
// it does this by:
// 1) looking at the authorization header of incoming request 
// 2) checks header to have value "Bearer[actual token]"
// 3) splits value by (' ') and takes second part (index[1]) --> which should be the token 
export const authenticate: RequestHandler = async (req, res, next) => {
    //RequestHandler -> Typescript type that ensures authenticate function has correct signature to be used as Express Middleware 
    // RequestHandler is like a contract -> it will not only recieve information about the request & have ability to send response -> but it can decide whether to pass control to the next piece of middleware 
    const token = req.headers.authorization?.split(" ")[1]; // ? -> here is a saftey check (optional chaining) --> prevents error if authorization is undefined 
    //Authorization header looks like --> Authorization: Bearer <token> (we want [1] the second piece of info here)
    //this middleware sits between the incoming request and route handlers 

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    //if the token is not present -> set the response to 401 -> send json message -> return from the function/ stop further excecution

    // verify the token using AUTH_SECRET -> if successful -> extract the ID from verified token payload 
    const { id } = verify(token, AUTH_SECRET);
    //set the req.user to an object with property 'id' equal to the extracted id 
    // attatch the user ID to the request object 
    req.user = {
        id: id,
    };
    //call next middleware function 
    next();
}
