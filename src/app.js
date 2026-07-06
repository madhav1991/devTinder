const express = require("express");
const app = express();
const connectMongose = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment')
const chatRouter = require('./routes/chat')
const http = require('http');

const cors = require('cors');
const initializeSocket = require("./utils/socket");

const server = http.createServer(app);
initializeSocket(server);

require('dotenv').config();
require('./utils/cronjob');


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter)


connectMongose().then(() => {
    console.log("Database connected successfully");
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.log(error);
})

