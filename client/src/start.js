import ReactDOM from "react-dom";
import Welcome from "./welcome";
// import HelloWorld from "./helloWorld";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("data in start.js: ", data);
        if (!data.userID) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <img src="/logo.jpg" alt="logo" />,
                document.querySelector("main")
            );
        }
    });
