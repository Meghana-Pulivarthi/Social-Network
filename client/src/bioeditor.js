import { Component } from "react";

export default class Bioeditor extends Component {
    constructor(props) {
        super(props),
            (this.state = {
                showTextArea: false,
                draftBio: "",
            });
    }

    handleBioChange(e) {
        console.log("handle bio change is running");
        console.log("e value", e.target.value);

        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleEdit() {
        this.setState({
            showTextArea: true,
            draftBio: this.props.bio,
        });
    }
    submitBio() {
        console.log("Clicked on submit bio");
        fetch("/bioedit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bio: this.state.draftBio }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data in edit bio", data);
                this.props.setBio(data.payload.bio);

                this.setState({
                    showTextArea: false,
                });
            })
            .catch((error) => {
                console.log("Error in  bio edit ", error);
            });
    }

    render() {
        return (
            <div id="bio">
                {this.state.showTextArea && (
                    <div>
                        <textarea
                            name="draftBio"
                            value={this.state.draftBio}
                            onChange={(e) => this.handleBioChange(e)}
                        />

                        <button onClick={() => this.submitBio()}>Save</button>
                    </div>
                )}
                {!this.state.showTextArea && this.props.bio && (
                    <div>
                        <p>{this.props.bio}</p>
                        <button onClick={() => this.handleEdit()}>
                            Edit Bio
                        </button>
                    </div>
                )}
                {!this.state.showTextArea && !this.props.bio && (
                    <div>
                        <button onClick={() => this.handleEdit()}>
                            Add bio
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
