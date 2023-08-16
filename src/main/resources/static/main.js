'use strict';

const usernameForm = document.querySelector("#username-page-form");
const chatForm = document.querySelector("#chat-page-form");
const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');

let stompClient;
let username;

function messageReceived(payload) {
    let message = JSON.parse(payload.body);
    if(message.type == "CHAT") console.log(message.sender + ": " + message.content);
    else console.log(message.content);
}

function onConnected() {
    stompClient.subscribe("/topic/public", messageReceived);
    stompClient.send("/app/chat.addUser", {}, JSON.stringify(
        {
            content: username + " has joined the chat!",
            sender: username,
            type: 'JOIN'
        }
    ));

    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');
}

function connect(event) {
    event.preventDefault();

    username = document.querySelector('#name').value.trim();

    let socket = new SockJS("/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected);
}

function chat(event) {
    let content = document.querySelector('#content').value.trim();
    let message = {
        sender: username,
        content: content,
        type: 'CHAT'
    }

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
    document.querySelector('#content').value = "";
    event.preventDefault();
}

usernameForm.addEventListener("submit", connect);
chatForm.addEventListener("submit", chat);