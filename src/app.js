const express = require("express");
const app = express();
// const { adminAuth, userAuth } = require('./middlewares/auth')
const connectMongose = require('./config/database');
const User = require('./models/user');
const user = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User created successfully!");
    } catch (error) {
        console.log(error)
        res.statusCode(500).send("Error creating user")
    }
})

app.get("/user", async (req, res) => {
    const users = await User.find({ email: req.body.email })
    if (users.length === 0) {
        res.sendStatus(400).send("User does not exist")
    }
    else {
        res.send(users)
    }
})

// get all the users for feed
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.send(400).send("Error fetching users");
    }
});
connectMongose().then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
        console.log(`Server is running on port 3000`);
    });
}).catch((error) => {
    console.log(error);
})

