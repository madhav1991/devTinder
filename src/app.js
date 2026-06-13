const express = require("express");
const app = express();
// const { adminAuth, userAuth } = require('./middlewares/auth')
const connectMongose = require('./config/database');
const User = require('./models/user');

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Lala",
        lastName: "Bhaskara",
        email: "lbsk@test.com",
        password: "nopassword",
    });

    try {
        await user.save();
        res.send("User created successfully!");
    } catch (error) {
        console.log(error)
        res.statusCode(500).send("Error creating user")
    }
})
connectMongose().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
}).catch((error) => {
    console.log(error);
})

