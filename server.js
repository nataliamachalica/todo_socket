const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const app = express();

const tasks = [];

app.use(cors());

const server = app.listen(process.env.PORT || 8000, () => {
	console.log('Server is running on port 8000')
});

const io = socket(server);

app.use((req, res) => {
	res.status(404).send('404 not found')
});

io.on('connection', (socket) => {
	socket.emit('updateData', tasks);

	socket.on('addTask', task => {
		console.log(`${socket.id} added ${task}`);
    tasks.push(task);
		socket.broadcast.emit('addTask', task);
	});

	socket.on('removeTask', i => {
		console.log(`${socket.id} removed task ${i}`);
		task.splice(i, 1);
		socket.broadcast.emit('removeTask', i);
	});
});