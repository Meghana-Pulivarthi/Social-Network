//reducer
export default function messagesReducer(messages = [], action) {
    console.log({ messages, action });
    if (action.type === "/messages/received") {
        messages = action.payload.messages;
        console.log("messages", messages);
    }
    if (action.type === "/messages/new-message") {
        console.log("add new msg");
        messages = [...messages, action.payload.message];
        console.log("messages in slice", messages);
    }
    return messages;
}
// Action Creators ---------------------------------------------
export function messagesReceived(messages) {
    return {
        type: "/messages/received",
        payload: { messages },
    };
}

export function addNewMessage(message) {
    return {
        type: "/messages/new-message",
        payload: { message },
    };
}
