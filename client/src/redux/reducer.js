import { combineReducers } from "redux";
import friendswannabeeReducer from "./friends/slice";
import messagesReducer from "./messages/slice";
const rootReducer = combineReducers({
    friends: friendswannabeeReducer,
    messages: messagesReducer,
});
export default rootReducer;
