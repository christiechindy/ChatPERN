const express = require("express");
const pg = require("pg");
const pool = require("./db/db");
const knex = require("./db/knex");
const cors = require("cors");
require("dotenv").config({path: __dirname + '/.env' });

const app = express();
app.use(cors());
app.use(express.json());

// if i dont put this following code, the API endpoint will always be called twice.
// Enable CORS for all requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change * to specific origins as needed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache CORS preflight response for 24 hours
    next();
});
// Handle CORS preflight requests
app.options('*', (req, res) => {
    res.status(200).end();
});

const conString = process.env.DB_CONNECTION //Can be found in the Details page
const client = new pg.Client(conString);
client.connect(function (err) {
    if (err) {
        return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function (err, result) {
        if (err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].theTime);
        client.end();
    });
});

const PORT = process.env.PORT || 5000;

const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://192.168.18.7:3000",
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data)
    })

    socket.on("send_message", (data) => {
        socket.to(data.relation_id).emit("receive_message", data);
    })

    socket.on("set_online_status", (isOnline, relation_id) => {
        socket.to(relation_id).emit("receive_status", isOnline);
    })
})

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const invRoutes = require("./routes/invitations");
app.use("/inv", invRoutes);



//friend profile in room chat
app.get("/friend=:friend_id", async (req, res) => {
    const friend_account = await knex.select(["pict", "name", "email"]).from("users").where({user_id: req.params.friend_id});

    friend_account[0].pict = friend_account[0]?.pict ||  "";

    res.json(friend_account[0]);
})

//get messages of a room
app.get("/messages/:relation_id", async (req, res) => {
    const messages = await knex.select(["message_id", "sent_time", "sender_id", "words"]).from("messages").where({relation_id: req.params.relation_id}).orderBy("sent_time", "asc");

    res.json(messages);
})

//send message in a room
app.post("/sendmessage", async (req, res) => {
    try {
        await knex("messages").insert({
            sent_time: req.body.sent_time,
            sender_id: req.body.sender_id,
            relation_id: req.body.relation_id,
            words: req.body.words
        }).then(res.json("Has been saved in database"))
    } catch (err) {
        console.log(err);
    }
})

//list friends
app.get("/:my/friends", async (req, res) => { //req.params.my    
    const relations = await knex.select(["person1", "person2", "relation_id"])
                   .from("friends_relation")
                   .where({"person1": req.params.my}).orWhere({"person2": req.params.my})
                   .where({"status": true})
    
    let friends = [];
    for (let i = 0; i < relations.length; i++) {
        friends.push({});
        friends[i].relation_id = relations[i].relation_id;

        if (relations[i].person1 == req.params.my) {
            friends[i].friend_id = relations[i].person2;
        } else {
            friends[i].friend_id = relations[i].person1;
        }

        const friend_info = await knex.select(["pict", "name", "email"]).from("users").where({user_id: friends[i].friend_id});
        // console.log(friend_info);

        friends[i].pict = friend_info[0].pict;
        friends[i].name = friend_info[0].name;
    }
    
    res.json(friends);
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))