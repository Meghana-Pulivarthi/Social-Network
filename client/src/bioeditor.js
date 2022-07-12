import { Component } from "react";

export default class Bioeditor extends Component {
    constructor(props) {
        super(props),
            (this.state = {
                showTextArea: false,
                draftBio: "",
            });
    }

    // the bio that the user types in the bioeditor component's text area is the DRAFT BIO
    // the bio tht the user submits and is successfully inserted into the db and sent back is the OFFICIAL BIO which should live in APP

    handleBioChange(e) {
        console.log("handle bio change is running");
        console.log("e value", e.target.value);

        this.setState({
            // to make left side dynamic we use []
            [e.target.name]: e.target.value,
        });

        // in here, you want to keep track of the draft bio that the user types
        // store whatever that value is in bioEditor's state as the 'draftBio'
    }
    handleEdit() {
        this.setState({
            showTextArea: true,
        });
    }
    submitBio() {
        // this should run whenever the user clicks save / submit (whenever they're done writing their bio)
        // TODO:
        // 1. make a fetch POST request and send along the draftbio the user typed (this.state.draftBio)
        // 2. make sure you send the newly inserted bio from the server back to bioEditor
        // 3. once you see it, make sure you send this newly inserted bio back to APP as this newly inserted bio / official bio will live in the state of App
        // the bio that lives in App's state is the official one ✅
        // you can do something like -> this.props.setBio(newBio)
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
            <div>
                {/* Do your rendering logic in here!
            It all depends on whether you are on edit more or not.
            Whenever they click on the add or edit button, you are on edit mode - show the text area!

            If showTextArea is true, then render the text area with a button that says save / submit
            If you're not adding or editing a bio, then you should NOT see the text area 
            If you're NOT in edit mode, THEN check to see if there is a bio! 

            if there is a bio, allow them to EDIT a bio! 
            if there is NO bio, allow them to ADD a bio! */}
                {/* {this.state.bioExist && (
                    <button onClick={(e) => this.handleSubmit(e)}>
                        Add your bio!
                    </button>
                )} */}
                {this.state.showTextArea && (
                    <div>
                        <textarea
                            name="draftBio"
                            placeholder="enter bio"
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
