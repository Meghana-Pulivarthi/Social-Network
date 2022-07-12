import { Component } from "react";
export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("Props in upload", props);
    }
    componentDidMount() {
        console.log("Uploader mounted");
    }
    upload(e) {
        e.preventDefault();
        console.log("e.target", e.target);

        fetch("/upload", {
            method: "POST",
            body: new FormData(e.target),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log("data in upload", result.data);
                this.props.imageUpload(result.data);
                this.props.modalCallBack();
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
    render() {
        return (
            <div>
                <h2>I am uploader component</h2>
                <form onSubmit={(e) => this.upload(e)}>
                    <input name="upload" type="file" accept="image/*"></input>
                    <button>Upload</button>
                    <h2 onClick={() => this.props.modalCallBack()}>X</h2>
                </form>
            </div>
        );
    }
}