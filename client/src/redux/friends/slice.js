//will have mini reducer
//friends=[] is a property inside global state
export default function friendswannabeeReducer(friends = [], action) {
    // console.log({ friends, action });
    if (action.type == `/friendswannabees/recieve`) {
        //use spread opreator to prevent mutation
        friends = action.payload.friends;
        // console.log(friends)
    }

    if (action.type == `/friendswannabees/accept`) {
        friends = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });
        return friends;
    }
    if (action.type == `/friendswannabees/delete`) {
        friends = friends.filter((friend) => {
            if (friend.id != action.payload.id) {
                return friend;
            }
        });
    }

    return friends;
}

//actioncreators

export function recieveFriendsAndWannabees(friends) {
    return {
        type: "/friendswannabees/recieve",
        payload: { friends },
    };
}

export function acceptfriend(id) {
    console.log("id inside acceptfriend", id);
    return {
        type: "/friendswannabees/accept",
        payload: { id },
    };
}

export function deletefriend(id) {
    console.log("id inside delete friend", id);
    return {
        type: "/friendswannabees/delete",
        payload: { id },
    };
}

//you need to create an action creator for recieverFriendsAndWannabees
//methods to avoid mutation
// var obj = {
//     name: "meghana",
// };
// //1. ... spread operator
// var newObj = { ...obj };
// var newObj = { ...obj, last: "pulivarthi" };

// var arr = [1, 2, 3];
// var newArr = [...arr];
// var newArr = [...arr, 4];

//2. MAP works only on ARRAYS
//used for cloning, looping, changing each element in array
//map is just a loop
//it by default returns an array

//3. FILTER - an array method
//Great for removing things from an array
//it is also a loop that creates a copy
