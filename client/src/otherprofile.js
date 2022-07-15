import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Profile from "./profile";
import Friendbutton from "./friendButton";

export default function OtherProfile() {
    const [user, setUser] = useState({});
//  const [err, setErr] = useState();

    const history = useHistory();
    // const params = useParams();
    // console.log("params", params);
    const { otherProfile } = useParams();

    useEffect(() => {
        console.log("other profile just rendered");
        console.log("otherProfile", otherProfile);

        let abort = false;
        if (!abort) {
            fetch(`/api/find/${otherProfile}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("data otherProfile",data)
                    if (data.sameUser) {
                        history.push("/");
                    } else if (data.noUser) {
                        setUser(false);
                    } else if (data.match) {
                        setUser(data.profile);
                    }
                });
        }

        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            {user && (
                <div>
                    <h1>other profile component</h1>
                    <h2>
                        {user.first} {user.last}
                    </h2>
                    <img src={user.imgurl} alt={`${user.first} ${user.last}`} />
                    <h3>{user.bio}</h3>
                </div>
            )}
            {!user && (
                <div>
                    <h1> User Not Found!</h1>
                </div>
            )}
            <Friendbutton />
        </>
    );
}
