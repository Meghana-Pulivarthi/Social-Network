import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useAuthSubmit } from "./hooks/useAuthSubmit";
import { useStatefulFields } from "./hooks/useStatefulFields";

ReactDOM.render(
    <>
        <Login />
        <Register />
    </>,
    document.querySelector("main")
);

function Login() {
    const [values, handleUpdate] = useStatefulFields();
    const [err, handleSubmit] = useAuthSubmit("/login.json", values);
    return (
        <div>
            <pre>{JSON.stringify(values)}</pre>
            <pre>{JSON.stringify(err)}</pre>
            <h2>Login</h2>
            {err && <div>Oops! Something went wrong.</div>}
            <input onChange={handleUpdate} name="email" placeholder="email" />
            <input
                onChange={handleUpdate}
                name="pw"
                placeholder="password"
                type="password"
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    );
}

function Register() {
    const [values, handleUpdate] = useStatefulFields();
    const [err, handleSubmit] = useAuthSubmit("/register.json", values);
    return (
        <div>
            <h2>Register</h2>
            <pre>{JSON.stringify(values)}</pre>
            <pre>{JSON.stringify(err)}</pre>
            {err && <div>Oops! Something went wrong.</div>}
            <input
                onChange={handleUpdate}
                name="first"
                placeholder="first name"
            />
            <input
                onChange={handleUpdate}
                name="last"
                placeholder="last name"
            />
            <input onChange={handleUpdate} name="email" placeholder="email" />
            <input
                onChange={handleUpdate}
                name="pw"
                placeholder="password"
                type="password"
            />
            <button onClick={handleSubmit}>submit</button>
        </div>
    );
}
