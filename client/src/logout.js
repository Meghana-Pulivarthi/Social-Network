// import { Component } from "react";
// import { Link } from "react-router-dom";
// import Login from "./login";

// export default class Logout extends Component {
//     constructor() {
//         super();
//         this.state = {
//             error: false,
//         };

//         handleSubmit() {
//         // console.log("Clicked on submit btton");

//         fetch("/logout", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(this.state),
//         })
              
//                 this.setState({
//                     error: true,
//                 });
        
           
//     }
//     }

//     render() {
//         return (
//             <>
//                 <h1>In logout</h1>
//                 <Link to="/">
//                     <p onClick={() => this.logout()} id="logout">
//                         Logout
//                     </p>
//                 </Link>
//             </>
//         );
//     }
// }
