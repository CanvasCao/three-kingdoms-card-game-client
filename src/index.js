import './style.css'
import {io} from './socket/socket.io.esm.min'
import {renderUser} from "./views/user";

const socket = io('http://localhost:3000');

const $sha = $("#sha");
const $users = $("#users");
$sha.click(() => {
    socket.emit('sha');
})

socket.emit('addUser');

socket.on('refreshStatus', (data) => {
    console.log('refreshStatus', data);
    $users.html(data.users.map((user) => renderUser(user)).join(''));
});

socket.on('new message', (data) => {
    console.log(data.message)
});


