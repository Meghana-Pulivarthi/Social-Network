import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import Logo from "./logo";
import Profile from "./profile";
import Upload from "./uploader";
import Profilecontent from "./profilecontent";
import FindPeople from "./findpeople";
import OtherProfile from "./otherprofile";
import FriendsWannabee from "./friends-wannabee";
import Logout from "./logout";
import Chat from "./chat"

// import Logout from "./logout";

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
        // console.log("App mounted");

        fetch("/user")
            .then((res) => res.json())
            .then((data) => {
                // console.log("data in /users", data);
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
                    <header>
                        {/* <Route exact path="/"> */}
                        <Profile
                            first={this.state.first}
                            last={this.state.last}
                            imgurl={this.state.imgurl}
                            modalCallBack={() => this.toggleModal()}
                        />
                        {/* </Route> */}

                        <Logo />
                    </header>
                    <nav id="navbar">
                            {" "}
                            <Link to="/find">Find Friends&nbsp;</Link>
                            {/* <Link to="/">Upload Profile Picture</Link> */}
                            <Link to="/profile">My Profile&nbsp;</Link>
                            <Link to="/friendswannabee">
                                Friends And Wannabees&nbsp;
                            </Link>
                            <Link to="/chat">Chat&nbsp;</Link>
                            {/* <Link to="/logout">Log Out&nbsp;</Link>&nbsp; */}
                    </nav>
                    <Route exact path="/profile">
                        <Profilecontent
                            first={this.state.first}
                            last={this.state.last}
                            imgurl={this.state.imgurl}
                            bio={this.state.bio}
                            setBio={(e) => this.setBio(e)}
                            modalCallBack={() => this.toggleModal()}
                        />
                    </Route>

                    {this.state.uploadIsVisible && (
                        <Upload
                            imageUpload={(t) => this.imageUpload(t)}
                            modalCallBack={() => this.toggleModal()}
                        />
                    )}
                    <Route path="/find/:otherProfile">
                        <OtherProfile />
                    </Route>
                    <Route exact path="/find">
                        <FindPeople />
                    </Route>
                    <Route path="/friendswannabee">
                        <FriendsWannabee />
                    </Route>
                    {/* <Route path="/logout">
                        <Logout />
                    </Route> */}
                    <Route path="/chat">
                        <Chat />
                    </Route>
                </div>
            </BrowserRouter>
        );
    }
}
