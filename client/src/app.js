import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Logo from "./logo";
import Profile from "./profile";
import Upload from "./uploader";
import Profilecontent from "./profilecontent";
import FindPeople from "./findpeople";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "abd",
            last: "xcv",
            imgurl: "",
            uploadIsVisible: false,
            bio: "",
        };
    }
    componentDidMount() {
        console.log("App mounted");

        fetch("/user")
            .then((res) => res.json())
            .then((data) => {
                console.log("data in /users", data);
                this.setState({
                    first: data.userInfo.first,
                    last: data.userInfo.last,
                    imgurl: data.userInfo.imgurl,
                    bio: data.userInfo.bio,
                });
            });
    }
    toggleModal() {
        console.log("togglemodal running");
        this.setState({
            uploadIsVisible: !this.state.uploadIsVisible,
        });
    }
    imageUpload(arg) {
        // console.log(
        //     "method is running in app and argument is passed to it is:",
        //     arg
        // );
        //console.log(" this in method app", this);
        this.setState({
            imgurl: arg,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <nav>
                        <header>
                            <Logo />
                        </header>
                        <Link to="/find">Find Friends</Link>
                        <br></br>
                        <Link to="/">My Profile</Link>
                        <br></br>
                        <Link to="/">Logout</Link>
                    </nav>
                    <Profile
                        first={this.state.first}
                        last={this.state.last}
                        imgurl={this.state.imgurl}
                        modalCallBack={() => this.toggleModal()}
                    />
                    <Route path="/">
                        <Profilecontent
                            first={this.state.first}
                            last={this.state.last}
                            imgurl={this.state.imgurl}
                            bio={this.state.bio}
                            setBio={(e) => this.setBio(e)}
                        />
                    </Route>
                    {this.state.uploadIsVisible && (
                        <Upload
                            imageUpload={(t) => this.imageUpload(t)}
                            modalCallBack={() => this.toggleModal()}
                        />
                    )}
                    <Route path="/find">
                        <FindPeople />
                    </Route>
                </div>
            </BrowserRouter>
        );
    }
}
