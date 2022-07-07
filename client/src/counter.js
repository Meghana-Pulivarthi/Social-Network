import { Component } from "react";

class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
        //way to bind
        this.incrementCount = this.incrementCount.bind(this);
    }
    componentDidMount() {
        console.log("Counter just mounted");
    }
    incrementCount() {
        console.log("The user wants to increment the count ");
        // console.log("this", this);
        //to interact with state in react we use setState
        this.setState({
            count: this.state.count + 1,
        });
    }
    render() {
        return (
            <div>
                <h1>my prop val: {this.props.propVal}</h1>
                <h1>my prop val: {this.props.muffin}</h1>
                <h1>I am the counter</h1>
                <h2>Current count is {this.state.count}</h2>
                {/* /way to bind if button is like this refer above */}
                {
                    <button onClick={this.incrementCount}>
                        Click me to count up
                    </button>
                }
                <button onClick={() => this.incrementCount()}>
                    Click me to count up
                </button>
            </div>
        );
    }
}
export default Counter;
