function Notif(data) {
    return (
        <section key={data.idNotif}>
            <h2>{data.type}</h2>
            <p>{data.date}</p>
            <p>{data.message}</p>
        </section>
    );
}

export default Notif;
