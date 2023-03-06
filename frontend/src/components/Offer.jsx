function Offer(data) {
    var info = <></>;
    var precision = <></>;

    if(data["infos"].length > 1) info = (<main><h3>Informations :</h3>
    <p>{data["infos"]}</p></main>);
    if(data["precisions"].length > 1) precision = (<main><h3>Précision :</h3>
    <p>{data["precisions"]}</p></main>);

    if(data["inter"] && data["inter"].length > 0)
        return (
        <section key={data["idfOffre"]}>
            <h2>{data["villeDepart"] + " -> " + data["villeArrivee"]}</h2>
            <h3>{data["nom"] + " " + data["prenom"]}</h3>
            <p>{data["dateDepart"] + " " + data["heureDepart"]}</p>
            <h3>Arrêts intermédiaires :</h3>
            <ul className='citiesList'>
                {data["inter"].map((city, index) => <ul key={index}>{city}</ul>)}
            </ul>
            {precision}
            {info}
        </section>);
    else
        return (
            <section key={data["idfOffre"]}>
                <h2>{data["villeDepart"] + " -> " + data["villeArrivee"]}</h2>
                <h3>{data["nom"] + " " + data["prenom"]}</h3>
                <p>{data["dateDepart"] + " " + data["heureDepart"]}</p>
                {precision}
                {info}
            </section>);
};

export default Offer;