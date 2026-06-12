const express = require("express");
const app = express();
const { adminAuth, userAuth } = require('./middlewares/auth')

app.use("/getData", (req, res) => {
    throw new Error("error in get data");
})

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("something went wrong")
    }
})
app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
    res.send("User data sent!!!")
})
app.use("/user/login", (req, res) => {
    res.send("user logged in successfully");
});

// app.use("/user/data", userAuth, (req, res) => {
//     res.send("User data sent!!!")
// });

app.get("/admin/data", (req, res) => {
    res.send("All Admin data sent!!!")
});


// will only handle GET call to user
// app.get("/user/:id/:name", (req, res) => {
//     console.log(req.params);
//     res.send({
//         name: "Madhav",
//         age: 23,
//     })
// })

// app.post("/user", (req, res) => {
//     console.log("Post request to DB");
//     res.send("Data saved successfully!");
// })

// // app.get will match all HTTP requests to /test
app.get("/test", (req, res, next) => {
    console.log("Test Route Hit");
    res.send("Test Route Hit");
    next();
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
