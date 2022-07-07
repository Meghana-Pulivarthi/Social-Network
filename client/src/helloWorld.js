import Greetee from "./greetee";
import Counter from "./counter";
export default function HelloWorld() {
    const myText = <h1>I love JSX</h1>;
    const classForStyle = "some-class";
    const cohortName = "Cayenne";
    return (
        <div className={classForStyle}>
            <Greetee propName={cohortName} />
            {/* we get propName and number value from props argument in
         greetee.js argument which is a property, you can acess the value 
         in greetee.js as props.propName or props.number as it is function */}
            <Greetee propName={"Meghana"} number={43} />
            <Greetee />
            {myText}
            <h3
                style={{
                    color: "pink",
                    fontFamiliy: "Impact",
                    fontSize: "6rem",
                }}
            >
                {2 + 2}
            </h3>
            {/* {we can get the propVal and muffin value in counter.js
            in this.props.proVal this.props.muffin in class counter extends Component
            constructor has props here we use this. as class is a consturctor in disguise
              } */}
            <Counter propVal="xyz" muffin="abc" />
        </div>
    );
}
