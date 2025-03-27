import '../css_modules/feed.css'

function Feed() {
    return (
        <>
            <div className="postContainer">
                <div className="userInfo">
                    <img src="src\assets\placeholder.webp" alt="" />
                        <section>
                        <h1 className="userName">
                            Sven
                        </h1>
                        <p className="postDate">
                            25 March, 2025 at 15:17
                        </p>
                        </section>
                </div>
                <div className="bio">
                    <h1>Title</h1>
                    <p className="bio_text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dolore, nostrum eius fugiat vitae.</p>
                </div>
                <div className="post_stats">
                    <div className="stat_container_1">
                        <h2>
                            Time
                        </h2>
                        <p>
                            55min 30s
                        </p>
                    </div>
                    <div className="stat_container_2">
                        <h2>
                            Avg HR
                        </h2>
                        <p>
                            157 BPM
                        </p>
                    </div>
                    <div className="stat_container_2">
                        <h2>
                            Cal
                        </h2>
                        <p>
                            442 cal
                        </p>
                    </div>
                </div>
                <div className="postImageContainer">
                    <img src="src\assets\feed\workout_placeholder.webp" alt="" />
                </div>
                <div className="post_btns_container">
                    <div className="post_btns"><img src="src\assets\feed\favorite_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png" alt="" /></div>
                    <div className="post_btns"><img src="src\assets\feed\messenger.png" alt="" /></div>
                    <div className="post_btns"><img src="src\assets\feed\bookmark_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png" alt="" /></div>
                </div>
            </div>
        </>
    )
}

export default Feed