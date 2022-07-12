export default function Profile({ first, last, imgurl, modalCallBack }) {
    imgurl = imgurl || "/default.jpg";
    console.log("Image url", imgurl);

    return (
        <div>
            <h3>
                Profile component should be on top right corner.
                <br />
                My name is {first} and my last name is
                {last}
            </h3>
            <img
                onClick={() => modalCallBack()}
                src={imgurl}
                alt={(first, last)}
            />
        </div>
    );
}
