import { BrowserRouter, Route } from "react-router-dom";

import Registration from "./registration";
import Login from "./login";
import Reset from "./resetpassword";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to my Social Network</h1>
            <div id="logo">
                <img src="/logo.jpg" alt="logo" />
            </div>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <Reset />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
