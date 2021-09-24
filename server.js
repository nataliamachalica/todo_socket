const express = require('express');
const cors = require('cors');

const socket = require('socket.io');

const app = express();

let tasks = [];

const corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use((req, res) => {
	res.status(404).send('page not found');
})

const server = app.listen(process.env.PORT || 6000, () => {
	console.log('Server is running on port 6000: http://localhost:6000')
});

const io = socket(server);

io.on('connection', socket => {
	socket.emit('updateData', tasks);

	console.log('New client! id:' + socket.id);

	socket.on('addTask', task => {
		console.log('New task added ', newTask, 'by user: ' + socket.id);
    tasks.push(task);
		socket.broadcast.emit('addTask', task);
	});

	socket.on('removeTask', taskId => {
		const taskToRemove = tasks.findIndex(task => task.id === taskId);
		tasks.splice(taskToRemove, 1);
		socket.broadcast.emit('removeTask', taskId);
	});

});