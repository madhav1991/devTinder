const express = require("express");
const app = express();


app.listen(3001, () => {
    console.log(`Server is running on port 3000`);
});

app.use((req, res) => {
    res.send("This is dev tinder!");
})