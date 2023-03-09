import axios from "axios";
import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Notif from "../components/Notif";
import { url_api } from "../data/url_api";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "../styles/Notifications.css";

function Notifications() {
    const [data, setData] = useState([]);
    const [isGetData, setIsGetData] = useState(false);
    const [isData, setIsData] = useState(false);
    const [open, setOpen] = useState(false);
    const [dialogTuple, setDialogTuple] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        if (isUpdate) {
            getNotifs(localStorage.getItem("mail"));
        }
        setIsUpdate(false);
    }, [isUpdate]);

    const handleClickOpen = (tuple) => {
        setOpen(true);
        setDialogTuple(tuple);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRed = (id) => {
        setOpen(false);
        console.log("mettre la notif ", id, " a lu");
    };

    const handleDelete = () => {
        setOpen(false);
        deleteNotif(dialogTuple.idfNotif);
    };

    const handleUpdate = (idNotif, ref) => {
        setOpen(false);
        updateNotif(idNotif, ref);
        console.log("update ", idNotif);
    };

    async function getNotifs(id) {
        await axios
            .get(url_api.url + "/notifications", {
                params: {
                    mail: id,
                },
            })
            .then(function (response) {
                console.log(response.data);
                if (response.data.length > 0) {
                    setIsData(true);
                    console.log(response.data);
                    setData(response.data);
                } else {
                    setIsData(false);
                }
            });
    }

    async function updateNotif(idNotif, ref) {
        await axios
            .put(url_api.url + "/notifications", {
                idf: idNotif,
                ref: ref,
            })
            .then(function (response) {
                console.log(response.data);
                setOpen(false);
                setIsUpdate(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function deleteNotif(idNotif) {
        await axios
            .delete(url_api.url + "/notifications", {
                params: {
                    idf: idNotif,
                },
            })
            .then(function (response) {
                console.log(response.data);
                setOpen(false);
                setIsUpdate(true);
            });
    }

    function titleSwitch(param) {
        switch (param) {
            case "Reponse":
                return "Demande de participation à un trajet";
            case "Offre":
                return "Nouvelle offre privée";
        }
    }

    function dateChange(param) {
        const date = new Date(param);
        return (
            date.getDate().toString().padStart(2, "0") +
            "/" +
            (date.getMonth() + 1).toString().padStart(2, "0") +
            "/" +
            date.getFullYear()
        );
    }

    if (!isGetData) {
        getNotifs(localStorage.getItem("mail"));
        setIsGetData(true);
    } else {
        if (isData) {
            return (
                <div className="wrapper-notifications">
                    {data.map((tuple) => (
                        <div className="notif" key={tuple.idfNotif}>
                            <Link
                                key={tuple.idfNotif}
                                onClick={() => handleClickOpen(tuple)}
                            >
                                <Notif
                                    className={
                                        tuple.etat === 0 ? "non_lue" : ""
                                    }
                                    key={tuple.idfNotif + "notif"}
                                    titre={titleSwitch(tuple.typeNotif)}
                                    date={dateChange(tuple.dateNotif)}
                                    message={tuple.informations}
                                />
                            </Link>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle>
                                    <span className="title">
                                        {titleSwitch(dialogTuple.typeNotif)}
                                    </span>
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {dialogTuple.typeNotif === "Offre" ? (
                                            <>
                                                <Link
                                                    className="offre "
                                                    to={
                                                        "../offre/" +
                                                        dialogTuple.idfOffre
                                                    }
                                                >
                                                    {dialogTuple.informations}
                                                </Link>
                                            </>
                                        ) : (
                                            <>{dialogTuple.informations}</>
                                        )}
                                    </DialogContentText>
                                </DialogContent>

                                {dialogTuple.typeNotif === "Reponse" ? (
                                    dialogTuple.statutReponse === "attente" ? (
                                        <DialogActions>
                                            <Button
                                                color="success"
                                                variant="contained"
                                                onClick={() =>
                                                    updateNotif(
                                                        dialogTuple.idfNotif,
                                                        "accepter"
                                                    )
                                                }
                                            >
                                                Accepter
                                            </Button>
                                            <Button
                                                color="error"
                                                variant="contained"
                                                onClick={() =>
                                                    updateNotif(
                                                        dialogTuple.idfNotif,
                                                        "refuser"
                                                    )
                                                }
                                            >
                                                Refuser
                                            </Button>
                                        </DialogActions>
                                    ) : (
                                        <>
                                            {dialogTuple.statutReponse ===
                                            "accepter" ? (
                                                <>
                                                    <DialogContent>
                                                        <DialogContentText>
                                                            Vous avez déjà
                                                            acceptée cette
                                                            personne.
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            onClick={() =>
                                                                deleteNotif(
                                                                    dialogTuple.idfNotif
                                                                )
                                                            }
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </DialogActions>
                                                </>
                                            ) : (
                                                <>
                                                    <DialogContent>
                                                        <DialogContentText>
                                                            Vous avez déjà
                                                            refusée cette
                                                            personne.
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button
                                                            color="error"
                                                            variant="contained"
                                                            onClick={() =>
                                                                deleteNotif(
                                                                    dialogTuple.idfNotif
                                                                )
                                                            }
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </DialogActions>
                                                </>
                                            )}
                                        </>
                                    )
                                ) : (
                                    <>
                                        {dialogTuple.etat === 0 ? (
                                            <DialogActions>
                                                <Button
                                                    color="info"
                                                    variant="contained"
                                                    onClick={() =>
                                                        updateNotif(
                                                            dialogTuple.idfNotif,
                                                            null
                                                        )
                                                    }
                                                >
                                                    Marquer comme lue
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="contained"
                                                    onClick={() =>
                                                        deleteNotif(
                                                            dialogTuple.idfNotif
                                                        )
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </DialogActions>
                                        ) : (
                                            <DialogActions>
                                                <Button
                                                    color="error"
                                                    variant="contained"
                                                    onClick={() =>
                                                        deleteNotif(
                                                            dialogTuple.idfNotif
                                                        )
                                                    }
                                                >
                                                    Supprimer
                                                </Button>
                                            </DialogActions>
                                        )}
                                    </>
                                )}
                            </Dialog>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <div>Vous n'avez pas de notifications pour le moment</div>;
        }
    }
}

export default Notifications;
