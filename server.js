const express = require('express')
const cors = require('cors')
const path = require('path')
const { port } = require('./config')

const app = express()

//sets
app.set('port', process.env.port || port)

//mids
app.use(cors())
    .use(express.json())
    .use(express.static(path.join(__dirname, 'public')));


//vamonos
const server = app.listen(app.get('port'), () => console.log(`🐚  Server listening on ${app.get('port')}... `))


const socketIo = require('socket.io')
const io = socketIo(server)

const users = {}

io.on('connection', socket => {
    console.log(`··· socket: ${socket.id}`)

    socket.on('new-user', name => {
        users[socket.id] = { name: name || socket.id }
        io.emit('user-joined', users)
    })

    socket.on('new-msg', message => {
        socket.broadcast.emit('global-msg', { message, name: users[socket.id].name || socket.id })
    })

    socket.on('typing', () => socket.broadcast.emit('isTyping', users[socket.id].name || socket.id))
});

module.exports = { server, io }
