import { useState, useEffect } from "react";

export default function FindPeople() {
    console.log("Find people component here");
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let abort = false;
        (async () => {
            // console.log("useEffect in hello.js ran");
            try {
                console.log("searchInput right now", searchInput);
                const respBody = await fetch(`/findusers?=${searchInput}`);

                const res = await respBody.json();
                console.log("res", res);
                if (!abort) {
                    setUsers(res.data);
                } else {
                    console.log("ignore don't run a a state update");
                }
            } catch (err) {
                console.log("err on fetch spicedworld", err);
            }
        })(); // this closes the async iife
        return () => {
            console.log("cleanup running");
            abort = true;
        };
    }, [searchInput]);
    const handleInputChange = ({ target }) => {
        // console.log("user is typing");
        // console.log("target.value", target.value);
        setSearchInput(target.value);
    };

    return (
        <>
            <h2>Find People</h2>
            <input
                onChange={handleInputChange}
                // type="text"
                name="userSearch"
                // value={setSearchInput}
            />
            <ul>
                {users&&users.map((users, id) => {
                    // console.log("user", user);
                    // console.log("id", id);
                    return (
                        <li key={users.id}>
                            <img
                                src={users.imgurl}
                                alt={(users.first, users.last)}
                            />
                            {users.first} {users.last}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
