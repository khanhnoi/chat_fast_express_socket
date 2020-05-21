const path = require('path');
const http = require('http');
const express = require('express');

const formatMessage = require('./untils/messages');
const { userJoin, getCurrentUser, userLeave, getUsersRoom } = require('./untils/users');

const app = express();
const server = http.createServer(app);

//const socketio = require('socket.io');
// const io = socketio(server);
const io = require('socket.io')(server);

const POST = 3333 || process.env.POST;

//set Static Forder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Bot';
const welcome = 'Chào mừng bạn đến web test chat nhanh by Khánh Nòi ';
const byeUser = 'Ai đó đã rời phòng chat rồi !!';
const joinUser = 'Có thêm 1 bạn đã vào phòng chat.';

// run when client connect
io.on('connection', (socket) => {
	console.log('Có user kết nối' + socket.id);

	//listen user join room
	socket.on('join-room', ({ username, room }) => {
		console.log(username);
		// push user to users when 1 new user join
		const user = userJoin(socket.id, username, room);
		// join true room of user opt
		socket.join(user.room);
		//Welcome current user
		socket.emit(
			'welcome',
			formatMessage(botName, `Chào mừng ${user.username} đến web chat nhanh by Khánh Nòi `)
		);
		//send name current user
		socket.emit('server-send-name-user', user.username);
		
        //Send list users and name Room
        const users=getUsersRoom(user.room);
        console.log("Array Users on: ");
        console.log(users);

		io.to(user.room).emit('server-send-users-and-room', {
			users: getUsersRoom(user.room),
			room: user.room,
			//user:user.username
		});

		//Broadcast when a user connects in room
		socket.broadcast.to(user.room).emit('welcome', formatMessage(botName, `${user.username} đã vào phòng chat.`));

		//server listen for chatMessgae
		socket.on('chatMessage', (mes) => {
			console.log(mes);
			io.to(user.room).emit('server-send-message', formatMessage(user.username, mes, user.id));
		});
	});
	//Runs when client disconnects
	socket.on('disconnect', () => {
		console.log('Co 1 user ngat ket noi' + socket.id);
		const userL = userLeave(socket.id);
		//console.log(user);
		if (userL) {
			socket.broadcast
				.to(userL.room)
				.emit('a-user-disconnect', formatMessage(botName, `${userL.username} đã rời phòng chat rồi !!`));

                
        const users=getUsersRoom(userL.room);
        console.log("Array Users on2: ");
        console.log(users);
			//Send list users and name Room
			io.to(userL.room).emit('server-send-users-and-room', {
				users: getUsersRoom(userL.room),
				room: userL.room,
				// user:userL.username
			});
		}
	});
});

server.listen(POST, () => {
	console.log(`Server run in port ${POST}`);
});
