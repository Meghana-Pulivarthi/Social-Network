export default function Profile({ first, last, imgurl, modalCallBack }) {
    imgurl = imgurl || "/default.jpg";
    console.log("Image url", imgurl);

    return (
        <div>
            <img
                className="profile-pic"
                onClick={() => modalCallBack()}
                src={imgurl}
                alt={(first, last)}
            />
        </div>
    );
}
