import { combineReducers } from "redux";
import friendswannabeeReducer from "./friends/slice";
const rootReducer = combineReducers({
    friends: friendswannabeeReducer,
});
export default rootReducer;
