import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import "whatwg-fetch";
import "es6-promise/auto";

import Lista from "./components/Lista";
import Separatore from "./components/Separatore";
import Footer from "./components/Footer";
import Onboarding from "./components/Onboarding";

import "./styles.css";

const nl2br = require("react-nl2br");

const baseUrl = "https://minicart.it/";
let url_logo = `${baseUrl}img/original/minicart-icona.png`;
// tracking errori
Sentry.init({
  dsn:
    "https://f9d712165e144efe8c715e705c0b7e78@o48768.ingest.sentry.io/5203709"
});

// METODI GLOBALI
const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

// prendo il puntovendita da url
const pv = getParameterByName("pv") ? getParameterByName("pv") : "4";
//console.log(pv);

function App() {
  //SETTINGS E MENU DA API CALL
  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await window.fetch(
          baseUrl + "api/ordini/settings/" + pv + "/"
        );

        const jsonSettings = await settings.json();
        //console.log(jsonSettings);
        setSettings(jsonSettings);


        if (
          jsonSettings.logo != "" &&
          jsonSettings.logo.indexOf("https") > -1
        ) {
          url_logo = jsonSettings.logo;
        } else if (jsonSettings.logo != "") {
          url_logo = `${baseUrl}img/original/${jsonSettings.logo}`;
        }


        const response = await window.fetch(
          baseUrl + "api/ordini/menu/" + pv + "/"
        );
        const json = await response.json();
        // setPosts(json.data.children.map(it => it.data));
        let newJson = json.map(l => {
          return l.items.map(i => i);
        });
        var myNewArray = [].concat.apply([], newJson);
        setMenu(myNewArray);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  const emtyForm = {
    nome: "",
    indirizzo: "",
    email: "",
    telefono: "",
    note: "",
    note_pagamento: ""
  };

  // STATE
  const [settings, setSettings] = useState({});
  const [menu, setMenu] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [step, setStep] = useState(0);
  const [userdata, setUserdata] = useState(emtyForm);
  const [success, setSuccess] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [modalitaConsegna, setModalitaConsegna] = useState("Ritira in negozio");

  navigator.vibrate =
    navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    navigator.msVibrate;

  // METODI GLOBALI APP
  const addToCart = (index, e, ref) => {

    if (navigator.vibrate) {
      window.navigator.vibrate([50]);
    }

    // let viewportOffset = ref.current.getBoundingClientRect();
    // // these are relative to the viewport, i.e. the window
    // let top = viewportOffset.top;


 

    // let altezzaCard = ref.current.offsetHeight;
    // let attualePosizione = top;
    // let posizioneBordoInferiore = attualePosizione + altezzaCard;

    // let troppoBasso =
    //   window.innerHeight - posizioneBordoInferiore < 155 ? true : false;

    // if (troppoBasso) {
    //   window.scrollBy(0, 155 - (window.innerHeight - posizioneBordoInferiore));
    // }
    let newCart = menu.map(p => {
      //console.log(index);
      return p.ID === index
        ? // ? { ...p, q: p.q + 1, descriptionVisible: true }
          { ...p, q: p.q + 1 }
        : p;
    });

    //console.log(newCart);

    setMenu(newCart);
  };
  const removeToCart = index => {

    if (navigator.vibrate) {
      window.navigator.vibrate([100]);
    }

    let newCart = menu.map(p => {
      //console.log(index);
      return p.ID === index ? { ...p, q: p.q - 1 } : p;
    });

    setMenu(newCart);
  };

  const addMenuNote = (index, val) => {
    let newCart = menu.map(p => {
      //console.log(index);
      return p.ID === index ? { ...p, noteRiga: val } : p;
    });

    setMenu(newCart);
  };

  const toggleDescription = (index, inputRef) => {
    let newCart = menu.map(p => {
      return p.ID === index
        ? { ...p, descriptionVisible: !p.descriptionVisible }
        : p;
    });
    setMenu(newCart);
    menu.forEach((item, i) => {
      if (item.ID === index && item.descrizione != "") {
        scrollToRef(inputRef);
        console.log("ha descrizione");
      }
    });
  };

  const toggleInfo = () => {
    let Newsettings = { ...settings, infoVisible: !settings.infoVisible };
    console.log(Newsettings);
    setSettings(Newsettings);
  };

  const toggleInfo = () => {
    let Newsettings = { ...settings, infoVisible: !settings.infoVisible };
    console.log(Newsettings);
    setSettings(Newsettings);
  };

  const openDescription = (index, inputRef) => {
    let newCart = menu.map(p => {
      return p.ID === index
        ? { ...p, descriptionVisible: !p.descriptionVisible }
        : p;
    });
    setMenu(newCart);
    scrollToRef(inputRef);
  };

  const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop);
  const calculatePrice = () => {
    //console.log(cart);
    const prezzo = menu.reduce(
      (prezzo, menu) =>
        parseFloat(
          parseFloat(prezzo) + parseFloat(menu.prezzo) * menu.q
        ).toFixed(2),
      0
    );
    return prezzo;
  };

  const getSpeseSpedizione = prezzo => {
    const spedizione =
      parseFloat(prezzo) > parseFloat(settings.soglia_sped_gratis) &&
      parseFloat(settings.soglia_sped_gratis) > 0
        ? 0
        : parseFloat(settings.spese_spedizione);
    return spedizione;
  };
  const changeStep = type => {
    console.log(step, type, settings.data_consegna_attivo);
    let newStep = type ? step + 1 : step - 1;
    if (step === 2 && settings.data_consegna_attivo == 0 && !type) {
      newStep = 0;
    }
    setStep(newStep);
  };
  const goToPaypal = () => {
    setStep(4);
    setPaymentType("paypal");
  };
  const goTocash = () => {
    setStep(4);
    setPaymentType("cash");
  };
  const goToBonifico = () => {
    setStep(4);
    setPaymentType("bonifico");
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    changeStep(true);
  };

  const postData = async (url = "", data = {}) => {
    // Default options are marked with *
    const fd = new FormData();
    fd.append("data", JSON.stringify(data));
    //console.log(JSON.stringify(data));
    const response = await window.fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"

        //"Content-Type": "application/x-www-form-urlencoded"
        //"Content-Type": "multipart/form-data"
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data) //fd //objectToFormData(data) // body data type must match "Content-Type" header
    });
    const dati = await response.json();
    return dati;
  };
  const inviaOrdine = async () => {
    const res = await postData(baseUrl + "api/ordini/new/" + pv + "/", {
      menu: menu,
      userdata: userdata,
      paymentType: paymentType,
      modalitaConsegna: modalitaConsegna
    });
    const result = await res;
    //console.log(result);
    if (result.success === true) {
      setSuccess(1);
      setOrderNumber(result.order_n);
    } else {
      setSuccess(-1);
    }
  };

  // APP

  var info = "";
  if (settings.info != "") {
    info = settings.infoVisible ? (
      <div className={`info infoVisible`} onClick={() => toggleInfo()}>
        <div>
          <strong>INFO</strong> <div>{nl2br(settings.info)}</div>
        </div>
      </div>
    ) : (
      <div className={`info `} onClick={() => toggleInfo()}>
        <strong>INFO</strong> {settings.info}
      </div>
    );
  }

  return (
    <div className="App">
      <div className="appContainer">
        {nl2br(info)}
        <h1>
          <img className="logo" alt={settings.title} src={url_logo} />
        </h1>

        <h2>{nl2br(settings.motto)}</h2>


        <div className={"productContainer step-" + step}>
          {menu.map((item, index2) => {
            return item.is_section == 1 ? (
              <Separatore product={item} nl2br={nl2br} />
            ) : (
              <Lista
                key={item.ID}
                product={item}
                f={{ addToCart, removeToCart, toggleDescription }}
                baseUrl={baseUrl}
                addMenuNote={addMenuNote}
                nl2br={nl2br}
              />
            );
          })}
        </div>
        <Footer
          success={success}
          setSuccess={setSuccess}
          step={step}
          changeStep={changeStep}
          settings={settings}
          orderNumber={orderNumber}
          paymentType={paymentType}
          userdata={userdata}
          setUserdata={setUserdata}
          inviaOrdine={inviaOrdine}
          handleSubmit={handleSubmit}
          goToPaypal={goToPaypal}
          goToBonifico={goToBonifico}
          goTocash={goTocash}
          nl2br={nl2br}
          getSpeseSpedizione={getSpeseSpedizione}
          calculatePrice={calculatePrice}
          modalitaConsegna={modalitaConsegna}
          setModalitaConsegna={setModalitaConsegna}
        />

        {/*<Onboarding settings={settings} menu={menu} />*/}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
