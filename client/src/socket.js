import { io } from "socket.io-client";
import { messagesReceived, addNewMessage } from "./redux/messages/slice";
export let socket;
export const init = (store) => {
    if (!socket) {
        //only establish a socket connection once
        socket = io.connect();
    }
    socket.on("last10messages", (msgs) => {
        console.log("server just emitted last 10 messages", msgs);
        store.dispatch(messagesReceived(msgs.messages));
    });
    socket.on("addnewmessage", (msg) => {
        console.log("server just emitted a new message", msg);
        store.dispatch(addNewMessage(msg));
    });
};
