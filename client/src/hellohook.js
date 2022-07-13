import { useState, useEffect } from "react";
export default function hello() {
    const [greetee, setGreetee] = useState("world");
    const [countries, setCountries] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    // useEffect allows us to have live cycle methods
    // to hook into react's render process
    // it accepts two argument
    // 1st a callback function to run
    // 2nd an array to limit when the effect should run
    // when we want to use useEffect as if it were componentDidMount
    // we pass an empty array as the second argument, if we want it
    // to run when a specific state property updates, we pass
    // that to the array
    useEffect(() => {
        let abort = false;
        (async () => {
            // console.log("useEffect in hello.js ran");
            try {
                console.log("searchInput right now", searchInput);
                const respBody = await fetch(
                    "https://spicedworld.herokuapp.com/?q=" + searchInput
                );
                const data = await respBody.json();
                console.log("data", data);
                if (!abort) {
                    setCountries(data);
                } else {
                    console.log("ignore don't run a a state update");
                }
            } catch (err) {
                console.log("err on fetch spicedworld");
            }
        })(); // this closes the async iife
        return () => {
            // this function runs, whenever there is another useEffect that gets triggered after
            // the initial one
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
            <input onChange={(e) => setGreetee(e.target.value)} />
            <h1>Hello {greetee}</h1>
            <h1>COUNTRIES</h1>
            <input onChange={handleInputChange} />
            <ul>
                {countries?.map((country, i) => {
                    // console.log("country", country);
                    // console.log("i", i);
                    return <li key={i}>{country}</li>;
                })}
            </ul>
        </>
    );
}
