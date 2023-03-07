import axios from "axios";
import {React, useState} from "react";
import {Link} from "react-router-dom";
import Notif from "../components/Notif";
import {url_api} from "../data/url_api";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Notifications() {
    const [data, setData] = useState([]);
    const [isGetData, setIsGetData] = useState(false);
    const [isData, setIsData] = useState(false);
    const [open, setOpen] = useState(false);
    const [dialogTuple,setDialogTuple] = useState([])

    const handleClickOpen = (tuple) => {
        setOpen(true);
        setDialogTuple(tuple)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRed = (id) => {
        setOpen(false);
        console.log("mettre la notif ", id, " a lu");
    };

    const handleDelete = (id) => {
        setOpen(false);
        console.log("supprimer la notif ", id);
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
                }
            });
    }

    async function updateNotif(idNotif) {
        await axios
            .put(url_api + "notifications", {
                params: {
                    idf: idNotif,
                },
            })
            .then(function (response) {
                console.log(response.data);
            });
    }

    async function deleteNotif(idNotif) {
        await axios
            .delete(url_api + "notifications", {
                params: {
                    idf: idNotif,
                },
            })
            .then(function (response) {
                console.log(response.data);
            });
    }

    if (!isGetData) {
        getNotifs(localStorage.getItem('mail'));
        setIsGetData(true);
    } else {
        if (isData) {
            return data.map((tuple) => (
                <div key={tuple.idfNotif}>
                    <Link key={tuple.idfNotif} onClick={() => handleClickOpen(tuple)}>
                        <Notif
                            key={tuple.idfNotif + "notif"}
                            type={tuple.typeNotif}
                            date={tuple.dateNotif}
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
                            {dialogTuple.typeNotif}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {dialogTuple.informations}
                            </DialogContentText>
                        </DialogContent>

                        {dialogTuple.typeNotif ==="Reponse" ?
                                dialogTuple.statutReponse === "attente" ? 
                                    <DialogActions>
                                    <Button onClick={handleClose}>
                                        Accepter
                                    </Button>
                                    <Button onClick={handleClose}>Refuser</Button>
                                    </DialogActions>
                                :
                                    <>
                                    {dialogTuple.statutReponse === "accepter" ? 
                                        <><DialogContent>
                                            <DialogContentText>
                                            Vous avez déjà acceptée cette personne.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleClose}>Supprimer</Button>
                                        </DialogActions></>
                                    :
                                    <><DialogContent>
                                            <DialogContentText>
                                            Vous avez déjà refusée cette personne.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleClose}>Supprimer</Button>
                                        </DialogActions></>
                                    }</>
                        
                        : 
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    Marquer comme lue
                                </Button>
                                <Button onClick={handleClose}>Supprimer</Button>
                            </DialogActions>
                            
                        }            
                    </Dialog>
                </div>
            ));
        } else {
            return <div>Il n'y a pas de notifications pour le moment</div>;
        }
    }
}

export default Notifications;
