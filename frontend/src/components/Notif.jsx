import "../styles/Notif.css";

function Notif(data) {
    return (
        <section className = {data.className}>
            <p className="titre">{data.titre}</p>
            <p className="date">{data.date}</p>
            <p>{data.message}</p>
        </section>
    );
}

export default Notif;
