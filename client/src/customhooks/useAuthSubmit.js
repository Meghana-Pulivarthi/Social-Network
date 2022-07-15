import { useState } from "react";

export function useAuthSubmit(url, vals) {
    const [err, setErr] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("making a fetch to", url);
        console.log("stringifiny the following state obj", vals);
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(vals),
        })
            .then((resp) => resp.json())
            .then((data) =>
                data.success ? location.replace("/") : setErr(true)
            );
    };
    return [err, handleSubmit];
}
