const express = require("express");
const app = express();
// const { adminAuth, userAuth } = require('./middlewares/auth')
const connectMongose = require('./config/database');

connectMongose().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
}).catch((error) => {
    console.log(error);
})

