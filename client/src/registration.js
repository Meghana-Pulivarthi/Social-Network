import { Component } from "react";
import { Link } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
        //binding this
        // this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        //console.log("Handle change is running");
        //console.log("e value", e.target.value);

        this.setState(
            {
                // to make left side dynamic we use []
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }

    handleSubmit() {
        // console.log("Clicked on submit btton");

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/register ", data);
                //4. if something goes wrong, conditonally render an err msg
                //5. if everything goes well , show logo do reload

                if (data.success) {
                    // this.setState({
                    //     error: false,
                    // });
                    console.log("Reloading page");
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((error) => {
                console.log("Error in  handle submit", error);
                this.setState({
                    error: true,
                });
            });
    }
    render() {
        return (
            <div id="register">
                <h1> This is a registration component</h1>
                {this.state.error && (
                    <p style={{ color: "red" }}>oops!something went wrong</p>
                )}
                <input
                    type="text"
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="text"
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="email"
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
                <p>
                    Already a memember?
                    <Link to="/login">Click here to Log in!</Link>;
                </p>

            </div>
        );
    }
}
