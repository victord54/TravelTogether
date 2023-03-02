function Group(groupe){
    return(
        <div className="groupe-box">
                <h2 className="titre-groupe">
                    {groupe["nomDeGroupe"]}
                </h2>
                <h3 className="membre-list">
                    Dirigeant :{" "}
                </h3>
                <p className="membre-list">
                    {groupe["dirigeant"]}
                </p>
                <h3 className="membre-list">
                    Membre(s) :{" "}
                </h3>
                <p className="membre-list">
                    {groupe["members"]}
                </p>
        </div>
    );
}

export default Group;