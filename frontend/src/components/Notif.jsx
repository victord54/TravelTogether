import "../styles/Notif.css";

function Notif(data) {
    return (
        <section>
            <h2>{data.type}</h2>
            <p>{data.date}</p>
            <p>{data.message}</p>
        </section>
    );
}

export default Notif;
