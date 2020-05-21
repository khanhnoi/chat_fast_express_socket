const chatForm = document.getElementById('chat-form'); // phan user nhap chat
const chatMessage = document.querySelector('.chat-messages');
const elmRoom = document.getElementById('room-name');
const elmUsers = document.getElementById('users');
const elmUser = document.getElementById('user-name');
const chat1 = document.getElementById('chat1');

const socket = io();

// get userName and Room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});
console.log(username, room);

//join room
socket.emit('join-room', { username, room });

//get user current
socket.on('server-send-name-user', (name) => {
	outputUserToDom(name);
});

//get info name Room and users
socket.on('server-send-users-and-room', ({ users, room, user }) => {
	// console.log(users);
	// console.log(room);

	outputUsersToDom(users);
	outputRoomToDom(room);
	// outputUserToDom(user);
});

socket.on('welcome', (formatMessage) => {
	console.log(formatMessage);
	//Scroll down
	//chatMessage.scrollTop = chatMessage.scrollHeight  ;
	outputToDom(formatMessage);
});
socket.on('a-user-disconnect', (formatMessage) => {
	console.log(formatMessage);
	outputToDom(formatMessage);
});
socket.on('server-send-message', (formatMessage) => {
	console.log(formatMessage);
	outputToDom(formatMessage);

	//Scroll down
});

// Submit message
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// get message text
	const msg = e.target.elements.msg.value;
	console.log(msg);
	//outputToDom(msg);

	//clear inputs
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();

	// emit msg to Server
	socket.emit('chatMessage', msg);
});

// function Output message to DOM

function outputToDom(formatMessage) {
	// const div = document.createElement('div');
	// div.classList.add('message');
	// div.innerHTML = `<p class="meta"> ${formatMessage.userName} <span>${formatMessage.time}</span></p>
    // <p class="text">
    // ${formatMessage.txtMes}
    // </p>`;

	//document.querySelector('.chat-messages').appendChild(div);

	//insertAdjacentHTML

	chat1.insertAdjacentHTML(
		'afterend',
		`<div class="message">
    <p class="meta" title="${formatMessage.id || "Đây là Bot"}">${formatMessage.userName}<span>  ${formatMessage.time}</span></p>
    <p class="text">
    ${formatMessage.txtMes}
    </p>
</div>`
	);
}
function outputUsersToDom(users) {
	//console.log(users);
	const list = `${users.map((user) => `<li>${user.username}</li>`).join('')}`;
	console.log(list);
	elmUsers.innerHTML = list;
}
function outputRoomToDom(room) {
	switch (room) {
		case 'shen':
			room = 'Thích Chơi Shen';
			break;
		case 'JavaScript':
			room = 'JavaScript';
			break;
		case 'lol':
			room = 'LOL';
			break;
		case "toplane":
			room = 'Hội TopLane';
			break;
		case "ghetDaDen":
			room = 'Ghét Da Đen';
			break;
		case "phanBietChungToc":
			room = 'Phân Biệt Chủng Tộc';
            break;
        case "hoiHocBong":
            room = 'Hội Học Bổng';
            break;

		default:
			break;
	}
	elmRoom.innerText = room;
}
function outputUserToDom(user) {
	elmUser.innerText = user;
}
