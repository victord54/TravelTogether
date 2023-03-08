function Offer(data) {
    var info = <></>;
    var precision = <></>;
    var inter = <></>;
    var date = new Date(data["dateDepart"]);
    var hour = new Date("July 1 2023 " + data["heureDepart"]);
    let boutonRepondreOffre = <></>;


    if(data["infos"].length > 1) info = (<main><h3>Informations :</h3>
    <p>{data["infos"]}</p></main>);
    if(data["precisions"].length > 1) precision = (<main><h3>Précision :</h3>
    <p>{data["precisions"]}</p></main>);

    if(data["inter"] && data["inter"].length > 0)
        inter = <main>
            <h3>Arrêts intermédiaires :</h3>
            <ul className='citiesList'>
                {data["inter"].map((city, index) => <li key={index}>{city}</li>)}
            </ul>
        </main>;

    if(data["email"] != localStorage.getItem('mail')){
        boutonRepondreOffre = <main><button onClick={console.log('hey')}>Répondre à l'offre</button></main>
    }

    return (
    <section key={data["idfOffre"]}>
        <h2>{data["villeDepart"]} &#8594; {data["villeArrivee"]}</h2>
                            <img
                                alt="profil"
                                src={
                                    data["photo"] +
                                    "?" +
                                    Math.random()
                                } width="75px"/>
                                <h3>{data["nom"] + " " + data["prenom"]}</h3>
        <p>Le {date.getDate().toString().padStart(2, "0") + "/" + (date.getMonth()+1).toString().padStart(2, "0") + "/" + date.getFullYear()} à {hour.getHours() + "h" + hour.getMinutes().toString().padStart(2, "0")}</p>
        {inter}
        {precision}
        {info}
    </section>
    );
};

export default Offer;