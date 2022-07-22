import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    recieveFriendsAndWannabees,
    acceptfriend,
    deletefriend,
} from "./redux/friends/slice.js";

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
    }, []);
    // if (!friends) {
    //     return null;
    // }

    const handleAccept = async (id) => {
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
                            <img src={friend.imgurl} alt= {`${friend.first} ${friend.last}`}/>
                    {friend.first} {friend.last}
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
                            <img src={wannabee.imgurl} alt={`${wannabee.first} ${wannabee.last}`}/>
                            {wannabee.first} {wannabee.last}
                            <button onClick={() => handleAccept(wannabee.id)}>
                                Accept friendship
                            </button>
                        </div>
                    );
                })}
        </>
    );
}
