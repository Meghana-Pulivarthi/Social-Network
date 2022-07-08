import { BrowserRouter, Route } from "react-router-dom";

import Registration from "./registration";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <h1>Welcome to my Social Network</h1>
            <img src="/logo.jpg" alt="logo"/>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
