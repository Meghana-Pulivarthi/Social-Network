export default function Profile({ first, last, imgurl, modalCallBack }) {
    imgurl = imgurl || "/default.jpg";
    // console.log("Image url", imgurl);

    return (
        <div id="profile-picture">
            {/* <header> */}
                <img
                    id="profile-pic"
                    onClick={() => modalCallBack()}
                    src={imgurl}
                    alt={(first, last)}
                />
            {/* </header> */}
        </div>
    );
}
