import {useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import {url_api} from "../data/url_api";

function AddMember_group()
{
  let {id} = useParams();
  const initialValue = {
    email: "",
  };
  const [formValues, setInputValues] = useState(initialValue);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isReplied, setIsReplied] = useState(false);
  const [isLoaded, setLoaded] = useState(false);

  async function handleSubmit(e)
  {
    e.preventDefault();
    var errors = await validateForm(formValues);
    setFormErrors(errors);
    setIsSubmit(true);
  }

  function handleChange(e)
  {
    setInputValues({...formValues, [e.target.name]: e.target.value});
  }

  async function sendDataToServer()
  {
    const formData = new FormData();
    formData.append("idfGroupe", id);
    formData.append("email", formValues.email);
    await axios
        .post(url_api.url + "/addmember_group", formData)
        .then(function()
        {
          setIsReplied(true);
        })
        .catch(function(error)
        {
          console.log("Error :" + error);
        });
  }

  async function validateForm(data)
  {
    const errors = {};

    //Vérification si l'utilisateur a rentré un email
    if(!data.email)
    {
      errors.email = "Aucun email n'a été saisie.";
    }
    else if(data.email === localStorage.getItem("mail"))
    {
      errors.email = "Ceci est votre email.";
    }
    else
    {
      await axios
          .get(url_api.url + "/addmember_group", {
            params: {
              email: formValues.email,
            },
          })
          .then(function(response)
          {
            if(response.data === "1")
            {
              setLoaded(true);
            }
            else
            {
              errors.email =
                  "Le mail saisie n'existe pas.";
            }
          })
          .catch(function(error)
          {
            console.log("Error :" + error);
          });
    }

    return errors;
  }

  if(
      isLoaded &&
      isSubmit &&
      !isReplied &&
      Object.keys(formErrors).length === 0
  )
  {
    sendDataToServer();
  }

  if(isReplied) return <Navigate replace to="../friends-group-list"/>;
  else
    return (
        <div className="form-box">
          <h1 className="inscription-titre ">Ajouter un nouveau membre</h1>
          <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="email"
                placeholder="Saisir l'email du nouveau membre"
                value={formValues.email}
                onChange={handleChange}
            ></input>
            <p className="error-form">{formErrors.email}</p>

            <div className="button-forms-wrap">
              <button type="submit" className="formulaire_submit">
                Valider
              </button>
            </div>
          </form>
        </div>
    );
}

export default AddMember_group;
