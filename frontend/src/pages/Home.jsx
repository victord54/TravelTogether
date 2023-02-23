import "../styles/Home.css";
import { useState } from "react";

function Home() {
    var isUser = false;
    const [user, setUser] = useState([]);
    if (localStorage.length > 0) {
        isUser = true;
    }

    return (
        <main>
            {isUser ? (
                <p>
                    Bienvenue {localStorage.getItem("nom")}{" "}
                    {localStorage.getItem("prenom")} !
                </p>
            ) : (
                <p> Bienvenue !</p>
            )}
            <article>
                <section>a</section>{" "}
                {/* A remplacer par un component pour afficher les trajets récents*/}
                <section>b</section>
                <section>c</section>
                <section>d</section>
                <section>e</section>
                <section>f</section>
                <section>g</section>
                <section>h</section>
                <section>i</section>
                <section>j</section>
                <section>k</section>
            </article>
        </main>
    );
}

export default Home;
