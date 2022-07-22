import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducer";
import { init } from "./socket";

//creating store i.e where our global state lives
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// import HelloWorld from "./helloWorld";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        // console.log("data in start.js: ", data);
        if (!data.userID) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //initialize websocket connection and pass the store to it
            init(store);
            ReactDOM.render(
                // store is a props
                <Provider store={store}>
                    <App />
                </Provider>,

                document.querySelector("main")
            );
        }
    });
