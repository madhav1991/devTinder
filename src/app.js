const express = require("express");
const app = express();


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

// // app.use will match all HTTP requests to /test
app.use("/test", ((req, res, next) => {
    console.log("Test Route Hit");
    res.send("Test Route Hit");
    next();
},
    (req, res) => {
        console.log("Test Route Hit 2");
        res.send("Test Route Hit 2");
    }
))


app.listen(3001, () => {
    console.log(`Server is running on port 3000`);
});

// app.use((req, res) => {
//     res.send("This is dev tinder!");
// })