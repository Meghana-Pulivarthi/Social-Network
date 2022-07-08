import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        console.log("Handle changein login is running");
        console.log("e value", e.target.value);

        this.setState(
            {
                // to make left side dynamic we use []
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }
    handleSubmit() {
        console.log("Clicked on submit btton");

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/login ", data);

                if (data.success) {
                    console.log("Reloading page");
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Erro in  handle submit", error);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div>
                <h1>This is the login component.</h1>
                {this.state.error && (
                    <p style={{ color: "red" }}>oops!something went wrong</p>
                )}
                <input
                    type="text"
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button type="submit" onClick={() => this.handleSubmit()}>
                    Submit
                </button>
                <Link to="/">Click here to register in!</Link>;
            </div>
        );
    }
}
