const express = require("express");
const app = express();
// const { adminAuth, userAuth } = require('./middlewares/auth')
const connectMongose = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const { userAuth } = require("./middlewares/auth");


app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        const { firstName, lastName, email, password } = req.body
        const bcryptHash = await bcrypt.hash(password, 10)
        const extractedUser = new User({
            firstName, lastName, email, password: bcryptHash
        })
        await extractedUser.save();
        res.send("User created successfully!");
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})

app.post("/login", async (req, res) => {
    // check email address first
    // check if entered password has correct hash in db

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials! email")
        }
        const isenteredPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("isenteredPasswordCorrect", isenteredPasswordCorrect)
        if (!isenteredPasswordCorrect) {
            throw new Error("Invalid credentials!")
        }
        else {
            const token = await jwt.sign({ _id: user._id }, "MADHAV@tinder$1991");
            console.log(token);

            res.cookie("token", token);
            res.send("Login successfull!")
        }
    }
    catch (error) {
        res.status(400).send(error.message)
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
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

