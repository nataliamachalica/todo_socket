const express = require('express');
const cors = require('cors');

const socket = require('socket.io');
const app = express();

app.use(cors());

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
	console.log('Server is running on port 8000')
});

const io = socket(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

app.use((req, res) => {
	res.status(404).send('404 not found')
});

io.on('connection', (socket) => {

	console.log('New client! id:' + socket.id);

	socket.emit('updateData', tasks);

	socket.on('addTask', newTask => {
		console.log('New task added ', newTask, 'by user: ' + socket.id);
    tasks.push(newTask);
		socket.broadcast.emit('addTask', newTask);
	});

	socket.on('removeTask', (id) => {
		console.log('Task removed', id);
		task.splice(id, 1);
		socket.broadcast.emit('removeTask', id);
	});
});