export default function Profile({ first, last, imgurl , modalCallBack}) {
    // console.log(
    //     "Props- info being passed down to profile from parent component app",
    //     props
    // );

    // define default.jpg in public

    imgurl = imgurl || "/default.jpg";
    console.log("Image url", imgurl);

    return (
        <div>
            <h2>
                I am profile component. My name is {first} and my last name is
                {last}
            </h2>
            <img
                onClick={() => modalCallBack()}
                src={imgurl}
                alt={(first, last)}
            />
        </div>
    );
}
