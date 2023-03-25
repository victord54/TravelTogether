import { Link } from "react-router-dom";
import "../styles/SeeOffer.css";


function Offer(data) {
    var info = <></>;
    var precision = <></>;
    var inter = <></>;
    var annulerParticipation = <></>;
    var date = new Date(data["dateDepart"]);
    var hour = new Date("July 1 2023 " + data["heureDepart"]);
    var boutonAnnulerParticipation; //affichage du bouton d'annulation de la participation à cette offre




    /*
    vérifier si la case du tableau "annulable" existe
    afficher le bouton 
    Récupérer l'utilisateur dans le localstorage
    */

    const dateD = new Date(date);
    dateD.setHours(hour.getHours());
    dateD.setMinutes(hour.getMinutes());
    const dateAuj = new Date();

    if(typeof data["participationAnnulable"] !== 'undefined'){ //l'offre n'est pas annulable
        console.log("ZEBIED");
        annulerParticipation = (
            <button> Annuler participation </button>
        ); //rendre moins dégueu
    }

    if (data["infos"].length > 1)
        info = (
            <main>
                <h3>Informations :</h3>
                <p>{data["infos"]}</p>
            </main>
        );
    if (data["precisions"].length > 1)
        precision = (
            <main>
                <h3>Précision :</h3>
                <p>{data["precisions"]}</p>
            </main>
        );

    if (data["inter"] && data["inter"].length > 0)
        inter = (
            <main>
                <h3>Arrêts intermédiaires :</h3>
                <ul className="citiesList">
                    {data["inter"].map((city, index) => (
                        <li key={index}>{city}</li>
                    ))}
                </ul>
            </main>
        );

    var nbPlaceDispo = data["nbPlaceDisponible"] - ( data["nbPlacesReserves"] ? data["nbPlacesReserves"] : 0);
    var placedispo = (
        <p>Nombre de places disponibles : {nbPlaceDispo}</p>
    );
    if (nbPlaceDispo === 1)
        placedispo = (
            <p>Nombre de place disponible : {nbPlaceDispo}</p>
        );
    if (nbPlaceDispo === 0)
        placedispo = <p>Aucune place disponible.</p>;

    return (
        <section key={data["idfOffre"]}>
            <h2>
                {data["villeDepart"]} &#8594; {data["villeArrivee"]}
            </h2>
            <h1>
                {data["prix"]} €
            </h1>
            <img
                alt="profil"
                src={data["photo"] + "?" + Math.random()}
                width="75px"
            />
            <h3>{data["nom"] + " " + data["prenom"]}</h3>
            <p>
                Le{" "}
                {date.getDate().toString().padStart(2, "0") +
                    "/" +
                    (date.getMonth() + 1).toString().padStart(2, "0") +
                    "/" +
                    date.getFullYear()}{" "}
                à{" "}
                {hour.getHours() +
                    "h" +
                    hour.getMinutes().toString().padStart(2, "0")}
            </p>
            {inter}
            {precision}
            {info}
            {dateD < dateAuj ? (
                <Link to={"/rating-user/" + data["idfOffre"]}>
                    <button>Noter les participants</button>
                </Link>
            ) : (
                <>{placedispo}{annulerParticipation}</>
            )}
        </section>
    );
}

export default Offer;
