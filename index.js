const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const Sse = require('json-sse');

const stream = new Sse();
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'

const db = new Sequelize(databaseUrl)

const ChatRoom = db.define('chatroom',{
    messages: {
        type:Sequelize.STRING,
        allowNull: false
    },
    user:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

db.sync({force:false})
   .then(() => console.log('database synced'))
   .catch((error) => console.error(error));

const app =  express()
app.use(bodyParser.json())

const port = process.env.PORT || 4000;

app.post("/message", async (req,res) => {
    await ChatRoom.create(req.body)
    const room = await ChatRoom.findAll();
    const data = JSON.stringify(room)
    stream.send(data);
   res.status(200);
   res.send("Thanks for your message")
})

app.get("/", (req,res) => {
    console.log('got a request');
    res.status(200);
    res.send("heloo world")

});

app.get('/stream',async(req,res) => {
    console.log("got a request on stream");
    const room = await ChatRoom.findAll();
    const data = JSON.stringify(room)
    console.log("messages in the room are", data)
    stream.updateInit(data)
    stream.init(req,res)
})

app.listen(port,() => console.log(`Listening to port ${port}`))

