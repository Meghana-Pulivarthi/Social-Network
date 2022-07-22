import { BrowserRouter, Route } from "react-router-dom";

import Registration from "./registration";
import Login from "./login";
import Reset from "./resetpassword";

export default function Welcome() {
    return (
        <div>
            <header>
                <img id="logomain" src="/logo.jpg" alt="logo" />
            </header>
            <h2 id="intro">
                Hello cricket enthusiasts! Join us and find friends with common
                interest Cricket 🏏.
            </h2>

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
