import '../css_modules/profile_card.css'

function ProfileCard () {
    return (
        <>
        <div id="cardContainer">
            <div id="imageContainer">
                <h1 id="cardName">
                    Sven
                </h1>
                <img src="src\assets\placeholder.webp" alt="" id="cardImage" />
                <div id="generalContainer">
                    <div id="infoContainer">
                        <p className="generalInfo">Looking for friends</p>
                        <p className="generalInfo">Within 10km</p>
                    </div>
                    <div id="sportContainer">
                        <p className="sports">Boxing</p>
                        <p className="sports">Fitness</p>
                    </div>
                </div>
            </div>
            <div id="aboutContainer">
                <p id="aboutSection">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium iste placeat deleniti, voluptatem harum commodi veniam impedit beatae earum nostrum rerum quae, doloremque </p>
                <div id="labelContainer">
                    <p className="labels">Favorite meal: Pizza</p>
                    <p className="labels">Fitness level: Advanced</p>
                    <p className="labels">Preffered workout time: 16:00 - 18:00</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProfileCard