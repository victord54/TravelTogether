function Offer(data) {
    return (
    <section key={data["idfOffre"]}>
        <h2>{data["nom"] + " " + data["prenom"]}</h2>
        <p>{data["dateDepart"] + " " + data["heureDepart"]}</p>
        <h3>Précision :</h3>
        <p>{data["precisions"]}</p>
        <h3>Informations :</h3>
        <p>{data["infos"]}</p>
    </section>);
};

export default Offer;