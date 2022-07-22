import { useSelector } from "react-redux";
import { socket } from "./socket";
export default function Chat() {
    const messages = useSelector((state) => state.messages);
    console.log("state", messages);
    const keyCheck = (e) => {
        // console.log("what was pressed", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("What is the value of our input field", e.target.value);
            //time to let server know there is a new message
            socket.emit("new-message", e.target.value);
            //after emitting the msg we clear the text area
            e.target.value = "";
        }
    };
    return (
        <>
            <div id="chattitle">
                <h1>Welcome to chat</h1>
            </div>
            <div className="chat-display-container">
                {messages &&
                    messages.map((message) => {
                        return (
                            <div key={message.id}>
                                {message.message} @ {message.first}{" "}
                                {message.last}
                            </div>
                        );
                    })}
            </div>
            <br/>
            
            <textarea
                id="chattext"
                onKeyDown={keyCheck}
                placeholder="add your messages here"
            ></textarea>
        </>
    );
}
