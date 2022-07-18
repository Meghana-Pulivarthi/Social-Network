import { useState, useEffect } from "react";

export default function Friendbutton({ viewedUser }) {
    const [buttonTxt, setText] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`/api/relation/${viewedUser}`);
                const data = await resp.json();
                console.log("received data is, ", data);

                setText(data.buttonTxt);
            } catch (err) {
                console.log("error in fetching users' relationship ", err);
            }
        })();
    }, []);

    const handleFriendship = () => {
        (async () => {
            const resp = await fetch(`/api/requestHandle/${viewedUser}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ buttonTxt }),
            });
            const data = await resp.json();
            setText(data.buttonTxt);

            try {
            } catch (err) {
                console.log("error in posting users' relationship ", err);
            }
        })();
    };

    return (
        <>
            <button onClick={() => handleFriendship()}> {buttonTxt}</button>
        </>
    );
}
