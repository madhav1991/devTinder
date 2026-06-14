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
        res.status(500).send(error.message)
    }
})

app.get("/user", async (req, res) => {
    const users = await User.find({ email: req.body.email })
    if (users.length === 0) {
        res.status(400).send("User does not exist")
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
        res.status(400).send("Error fetching users");
    }
});

// delete the user based on unique id
app.delete("/user", async (req, res) => {
    try {
        const uniqueId = req.body.userId;
        await User.findByIdAndDelete({ _id: uniqueId })

        res.send("Deleted user successfully")
    } catch (err) {
        res.status(400).send("Error deleting user");
    }
})

// update the user 
app.patch("/user/:userId", async (req, res) => {
    try {
        const uniqueId = req.body.userId;
        const udpatedData = req.body;
        const ALLOWED_LIST = ["firstName", "lastName", "age", "gender"];
        const isAllowedDataGood = Object.keys(udpatedData).every((key) => ALLOWED_LIST.includes(key));
        if (!isAllowedDataGood) {
            throw new Error("Update not allowed due to restriction")
        }
        await User.findOneAndUpdate(udpatedData);
        res.send("User updated successfully")
    } catch (err) {
        res.status(400).send("Error Updating user" + err.message);
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

