import { Link } from "react-router-dom"
import '../css_modules/nav.css'

function Nav() {
    return (
        <>
            <div id="navContainer">
                <Link to={"/"}>
                    <button><img src="src\assets\nav\home.png" alt="" srcset="" className="navImages" /></button>
                </Link>
                <Link to={"/matching"}>
                    <button><img src="src\assets\nav\card.png" alt="" srcset="" className="navImages" /></button>
                </Link>
                <Link to={"/messages"}>
                    <button><img src="src\assets\nav\message.png" alt="" srcset="" className="navImages" /></button>
                </Link>
                <Link to={"/user"}>
                    <button><img src="src\assets\nav\user.png" alt="" srcset="" className="navImages" /></button>
                </Link>
            </div>
        </>
    )
}

export default Nav