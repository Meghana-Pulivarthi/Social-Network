import { useState } from "react";

export function useStatefulFields() {
    const [values, setValues] = useState({});
    function handleUpdate({ target }) {
        console.log("running stateupdate in useStatefulFields");
        setValues({
            ...values,
            [target.name]: target.value,
        });
    }
    return [values, handleUpdate];
}
