import Profile from "./profile";
import Bioeditor from "./bioeditor";

export default function Profilecontent(props) {
    console.log("Props in profile content", props);
    return (
        <div id="profile-content">
            <h2>
                {props.first} {props.last}
            </h2>
            <Profile imgurl={props.imgurl} />
            <Bioeditor bio={props.bio} setBio={(arg) => props.setBio(arg)} />
        </div>
    );
}
