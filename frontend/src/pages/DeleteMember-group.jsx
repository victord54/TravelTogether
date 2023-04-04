import {useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import "../styles/Signin.css";
import {url_api} from "../data/url_api";
import { useEffect } from "react";

function DeleteMember_group()
{
  let {id} = useParams();
  
  const [selectValue, setSelectValue] = useState('');
  const [isReplied, setIsReplied] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [members, setMembers] = useState([])

  if (!isLoaded){
    getMembers();
  }

  async function getMembers(){
    await axios.get(url_api.url + "/deletemember_group", { params: { idf: id } })
      .then((function (reponse) {
        setMembers(reponse.data);
        setSelectValue(reponse.data[0].email)
        setLoaded(true)
    }))
  }

  async function handleSubmit(e)
  {
    e.preventDefault();
    sendDataToServer();
  }

  function handleChange(e)
  {
    setSelectValue(e.target.value);
  }

  async function sendDataToServer()
  {
    const formData = new FormData();
    formData.append("idfGroupe", id);
    formData.append("email", selectValue);
    await axios
        .post(url_api.url + "/deletemember_group", formData)
        .then(function(response)
        {
          setIsReplied(true);
        })
        .catch(function(error)
        {
          console.log("Error :" + error);
        });
  }

  if(isReplied) return <Navigate replace to="../friends-group-list"/>;
  else
    if (isLoaded){
      return (
          <div className="form-box">
            <h1 className="delete-titre">Supprimer un membre</h1>
            <form onSubmit={handleSubmit}>
              <select value={selectValue} onChange={handleChange}>
              {members.map((member,index) => {
                return <option key={index} value={member.email}>{member.email}</option>
              })}
              </select>
              <div className="button-forms-wrap">
                <button type="submit" className="formulaire-submit">
                  Valider
                </button>
              </div>
            </form>
          </div>
      );
  } else {
    return <>Loading</>
  }
}

export default DeleteMember_group;
