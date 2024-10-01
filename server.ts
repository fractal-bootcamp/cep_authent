import express from "express";
import path from "path";
import cors from "cors"; //middleware 
import { sign } from "jsonwebtoken";
import { AUTH_SECRET, authenticate } from "./backend/middleware"


// create express app - use cors for middleware
const app = express();
app.use(express.json())
app.use(cors()); // this line adds middleware to our Express app that will run for every request -- checking if there is JSON payload -> parsing it -> and making result available on req.body
/* 
    APP.USE() -> application wide function to mount middleware functions -> telling Express to use a piece of middleware for all routes 
    
        app.use(express.json()) 
    ----- SAME AS ----- 
        const jsonMiddleware = express.json(); 
        app.use(jsonMiddleware);

    express.json() --> built-in middleware function in Express -> this function parses incoming requests with JSON payloads 
    -- when a request with a JSON payload is received --> this middleware will parse JSON and make it available in req.body
    JSON.parse() --> used bts to perform this conversion

    PARSE --> refers to the process of converting JSON string into JS object (data sent over HTTP is always in string format)
*/

const PORT = process.env.PORT || 3000;

const users = {
    "1": {
        name: "BOBBY",
        password: "123",
    },
    "2": {
        name: "BOB",
        password: "bobsworld",
    }
};

const generateToken = async (id: string) => {
    const token = sign({ id }, AUTH_SECRET);
    return token;
};

app.post("/login", async (req, res) => {
    //destructing the json body and parsing out name and password
    console.log("TRIGGERED")
    console.log(req.body) //is this supposed to be name/pss norman 123?
    const { name, password } = req.body;

    // checking if user and password have been provided as fields
    if (!name || !password) {
        res.status(401).json({ message: "MISSINGFIELD" }); //correct
        return;
    }
    // Object.entries(users) creates array from object so that we can use .find 
    // .find --> returns value of first element in array where predicate is true --> undefined otherwise 
    // (PREDICATE: operator that returns either t/f)
    const foundEntry = Object.entries(users).find(([, user]) => user.name === name); //callback function ([, user]) -> using a destructuring array to assign the users objects to two variables
    const user = foundEntry ? foundEntry[1] : undefined;
    const id = foundEntry ? foundEntry[0] : undefined;
    if (!id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    //checking is password is the correct password 
    if (user && user.password === password) {
        res
            .status(200)
            .json({ message: "Authenticated", token: await generateToken(id) });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

// authenticate middleware runs -> verifies token -> attatches user info into the request 
app.get("/authenticated", authenticate, (req, res) => {
    // using object destructuring to extract the name property --> req.user.id (accesses the id property of the user object)
    const { name } = users[req.user.id];

    res.send(name + " is authenticated");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 