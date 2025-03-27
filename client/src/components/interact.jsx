import { Link } from "react-router-dom"
import '../css_modules/interact.css'

function Interact() {
    return (
        <>
            <div id="interactContainer">
                <Link to={"/"}>
                    <button id="arrowButton" className="interactButtons"><img src="src\assets\next.png" /></button>
                </Link>
                <div id="btnContainer">
                    <button id="dislike" className="interactButtons"><img src="src\assets\letter.png" alt="" srcset="" /></button>
                    <button id="like" className="interactButtons" ><img src="src\assets\heart.png" alt="" srcset="" /></button>
                </div>
            </div>
        </>
    )
}

export default Interact