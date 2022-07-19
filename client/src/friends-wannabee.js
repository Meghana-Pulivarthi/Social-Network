import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    recieveFriendsAndWannabees,
    acceptfriend,
    deletefriend,
} from "./redux/friends/slice.js";
import { Link } from "react-router-dom";

export default function FriendsWannabee() {
    const dispatch = useDispatch();

    const wannabees = useSelector((state) =>
        // console.log("state",state)
        state.friends.filter((friend) => !friend.accepted)
    );
            console.log(" wannabees", wannabees);

    //you will need to do same as above for friends
    const friends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => friend.accepted)
    );
    console.log("friends", friends);

    //get all of our friends and wannabees when the component mounts
    useEffect(() => {
        if (friends.length == 0) {
            console.log("running");
            (async () => {
                const res = await fetch("/friendsandwannabees");
                const data = await res.json();
                console.log("data before /friendsandwannabees dispatch", data);
                dispatch(recieveFriendsAndWannabees(data.friends));
            })();
        }
        //step1 - make a get request to fetch friends and wannabees
        //once data is back
        //step 2: dispatch an action creator and pass to it the data you just got back
        //this will start the process of adding your friends and wannabees
        //(an big array of object containing both)
    }, []);
    // if (!friends) {
    //     return null;
    // }

    const handleAccept = async (id) => {
        //1. make a post request to update the db
        // STEP 2 - dispatch an action to update the global state
        // you'll need to create and import the action creator below
        const res = await fetch(`/acceptfriend/${id}`, { method: "POST" });
        const data = await res.json();
        console.log(`data from /acceptfriend/${id}`, data);
        if (data.success) {
            dispatch(acceptfriend(id));
        }
    };

    const handleUnfriend = async (id) => {
        const res = await fetch(`/deletefriend/${id}`, { method: "POST" });
        const data = await res.json();
        console.log(`data from /deletefriend/${id}`, data);
        if (data.success) {
            dispatch(deletefriend(id));
        }
    };

    return (
        <>
            <h1>Friends</h1>
            {friends &&
                friends.map((friend) => {
                    return (
                        <div key={friend.id}>
                            <button onClick={() => handleUnfriend(friend.id)}>
                                Unfriend
                            </button>
                        </div>
                    );
                })}
            <h1> wannabees</h1>
            {wannabees &&
                wannabees.map((wannabee) => {
                    return (
                        <div key={wannabee.id}>
                            <button onClick={() => handleAccept(wannabee.id)}>
                                Accept friendship
                            </button>
                        </div>
                    );
                })}
            <nav>
                <Link to="/acceptfriend">Accepted&nbsp;</Link>
                {/* <br/> */}
                &nbsp;
                <Link to="/deletefriend">Deleted&nbsp;</Link>
            </nav>
        </>
    );
}
