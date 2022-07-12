import { Component } from "react";
import Logo from "./logo";
import Profile from "./profile";
import Upload from "./uploader";
// import Profilecontent from "./profilecontent";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "abd",
            last: "xcv",
            imgurl: "",
            uploadIsVisible: false,
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
        console.log(
            "method is running in app and argument is passed to it is:",
            arg
        );
        console.log(" this in method app", this);
        this.setState({
            imgurl: arg,
        });
    }
    render() {
        return (
            <div>
                <h1>I am the main entry point for logged in experience</h1>
                <Logo />
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    imgurl={this.state.imgurl}
                    modalCallBack={() => this.toggleModal()}
                />
                {/* <Profilecontent
                    first={this.state.first}
                    last={this.state.last}
                    imgurl={this.state.imgurl}
                    modalCallBack={() => {
                        this.toggleModal();
                    }}
                /> */}
                {this.state.uploadIsVisible && (
                    <Upload
                        imageUpload={(t) => this.imageUpload(t)}
                        modalCallBack={() => this.toggleModal()}
                    />
                )}
            </div>
        );
    }
}