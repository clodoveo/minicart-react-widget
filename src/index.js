import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { PayPalButton } from "react-paypal-button-v2";
import "./styles.css";

const baseUrl = "https://minicart.it/";

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
const pv = getParameterByName("pv") ? getParameterByName("pv") : "3";
//console.log(pv);

const Lista = props => {
  const inputRef = React.createRef(null);
  const { product, f } = props;
  let removeBt = "";
  let openClass = "";
  if (product.q > 0) {
    removeBt = (
      <button className="remove" onClick={() => f.removeToCart(product.ID)}>
        <i className="fa fa-minus" />
      </button>
    );
    if (!product.descriptionVisible) {
      openClass = "open";
    }
  }

  let description = "";
  let priceCardClass = "";

  let fotoImg = "";
  if (product.foto != "") {
    fotoImg = (
      <div className="imgContainer">
        <img
          src={`${baseUrl}img/original/${product.foto}`}
          style={{ maxWidth: "100%" }}
          alt={product.title}
        />
      </div>
    );
  }

  if (product.descriptionVisible) {
    description = (
      <div className={"description animated fadeIn"}>
        <i
          className="fa fa-times closeCard"
          onClick={() => f.toggleDescription(product.ID, inputRef)}
        />
        {fotoImg}
        <p className="descriptionText">{product.descrizione}</p>
      </div>
    );
    priceCardClass = "card";
  }
  return (
    <div className="products" ref={inputRef}>
      <p
        className={"product-title " + openClass}
        onClick={() => f.toggleDescription(product.ID, inputRef)}
      >
        {product.title}
      </p>{" "}
      {description}
      <div className={"prices " + priceCardClass}>€ {product.prezzo}</div>
      <div className="buttons">
        {removeBt}
        <Indicator q={product.q}> </Indicator>
        <button
          className="add"
          onClick={e => f.addToCart(product.ID, e, inputRef)}
        >
          <i className="fa fa-plus" />
        </button>
      </div>
      <div className="clearer" />
    </div>
  );
};

const Indicator = props => {
  const { q } = props;
  return q > 0 ? <span className="indicator">{q}</span> : "";
};

function App() {
  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await fetch(
          baseUrl + "api/ordini/settings/" + pv + "/"
        );

        const jsonSettings = await settings.json();

        setSettings(jsonSettings);

        const response = await fetch(baseUrl + "api/ordini/menu/" + pv + "/");
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

  const [settings, setSettings] = useState({});
  const [menu, setMenu] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [step, setStep] = useState(0);
  const [userdata, setUserdata] = useState(emtyForm);
  const [success, setSuccess] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);

  const addToCart = (index, e, ref) => {
    let viewportOffset = ref.current.getBoundingClientRect();
    // these are relative to the viewport, i.e. the window
    let top = viewportOffset.top;

    let altezzaCard = ref.current.offsetHeight;
    let attualePosizione = top;
    let posizioneBordoInferiore = attualePosizione + altezzaCard;

    let troppoBasso =
      window.innerHeight - posizioneBordoInferiore < 125 ? true : false;

    if (troppoBasso) {
      window.scrollBy(0, 125 - (window.innerHeight - posizioneBordoInferiore));
    }
    let newCart = menu.map(p => {
      //console.log(index);
      return p.ID === index ? { ...p, q: p.q + 1 } : p;
    });
    //console.log(newCart);
    setMenu(newCart);
  };
  const removeToCart = index => {
    let newCart = menu.map(p => {
      //console.log(index);
      return p.ID === index ? { ...p, q: p.q - 1 } : p;
    });
    setMenu(newCart);
  };

  const toggleDescription = (index, inputRef) => {
    let newCart = menu.map(p => {
      //console.log(index);

      return p.ID === index && p.descrizione != ""
        ? { ...p, descriptionVisible: !p.descriptionVisible }
        : p;
    });
    setMenu(newCart);
    scrollToRef(inputRef);
  };
  const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop);
  const calculatePrice = () => {
    //console.log(cart);
    return menu.reduce(
      (prezzo, menu) => prezzo + parseFloat(menu.prezzo) * menu.q,
      0
    );
  };
  const changeStep = type => {
    let newStep = type ? step + 1 : step - 1;
    setStep(newStep);
  };
  const goToPaypal = () => {
    setStep(3);
    setPaymentType("paypal");
  };
  const goTocash = () => {
    setStep(3);
    setPaymentType("cash");
  };
  const goToBonifico = () => {
    setStep(3);
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
    const response = await fetch(url, {
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
      paymentType: paymentType
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

  let totale = "";
  let view = "";

  if (paymentType === "paypal" && step === 3) {
    view = (
      <div className="paypal">
        <h3>Paga ora:</h3>
        <PayPalButton
          amount={calculatePrice()}
          // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
          onSuccess={(details, data) => {
            //alert("Transaction completed by " + details.payer.name.given_name);

            // console.log(menu);
            // OPTIONAL: Call your server to save the transaction
            inviaOrdine();
          }}
          options={{
            clientId: settings.paypal_ID,
            currency: "EUR"
          }}
        />
      </div>
    );
  }
  if (paymentType === "cash" && step === 3) {
    view = (
      <div>
        <p>
          <label>{settings.testo_contanti}</label>
          <input
            type="email"
            name="note_pagamento"
            value={userdata.note_pagamento}
            onChange={e => {
              setUserdata({ ...userdata, note_pagamento: e.target.value });
            }}
          />
        </p>
        <button className="btn btn-invia" type="submit" onClick={inviaOrdine}>
          Invia ordine
        </button>
      </div>
    );
  }
  if (paymentType === "bonifico" && step === 3) {
    view = (
      <div>
        <p>
          <label>{settings.testo_bonifico}</label>
          <input
            type="email"
            name="note_pagamento"
            value={userdata.note_pagamento}
            onChange={e => {
              setUserdata({ ...userdata, note_pagamento: e.target.value });
            }}
          />
        </p>

        <button className="btn btn-invia" type="submit" onClick={inviaOrdine}>
          Invia ordine
        </button>
      </div>
    );
  }

  if (step === 1) {
    view = (
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <p>
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                required
                value={userdata.nome}
                onChange={e => {
                  setUserdata({ ...userdata, nome: e.target.value });
                }}
              />
            </p>
            <p>
              <label>Indirizzo:</label>
              <input
                type="text"
                name="indirizzo"
                required
                value={userdata.indirizzo}
                onChange={e => {
                  setUserdata({ ...userdata, indirizzo: e.target.value });
                }}
              />
            </p>
            <p>
              <label>Telefono:</label>
              <input
                type="tel"
                name="telefono"
                required
                value={userdata.telefono}
                onChange={e => {
                  setUserdata({ ...userdata, telefono: e.target.value });
                }}
              />
            </p>
            <p>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                required
                value={userdata.email}
                onChange={e => {
                  setUserdata({ ...userdata, email: e.target.value });
                }}
              />
            </p>
            <p>
              <label>NOTE :</label>
              <textarea
                name="note"
                onChange={e => {
                  setUserdata({ ...userdata, note: e.target.value });
                }}
                value={userdata.note}
              />
            </p>
          </div>
          <button
            className="btn btn-right"
            onClick={() => {
              // changeStep(true);
            }}
            type="submit"
          >
            Procedi
          </button>
        </form>
      </div>
    );
  }
  if (step === 2) {
    view = (
      <div>
        Metodo pagamento:
        <div className="btn-pagaora">
          <button className="btn" onClick={() => goToPaypal()}>
            Paypal
          </button>
          <button className="btn" onClick={() => goToBonifico()}>
            Bonifico
          </button>
          <button className="btn" onClick={() => goTocash()}>
            Contanti
          </button>
        </div>
      </div>
    );
  }

  let bottoneTotaleProcedi = "";
  if (step === 0) {
    bottoneTotaleProcedi = (
      <button className="btn btn-right" onClick={() => changeStep(true)}>
        Procedi
      </button>
    );
  } else {
    bottoneTotaleProcedi = (
      <button
        className=" btn-right btn-close"
        onClick={() => changeStep(false)}
      >
        <i className="fa fa-times" />
      </button>
    );
  }
  if (calculatePrice() > 0) {
    totale = (
      <div className="appFooter">
        <div className="tot">
          <span className="">Totale: </span>
          <span className="tot-price">€ {calculatePrice()}</span>
        </div>
        {bottoneTotaleProcedi}
        <div className="clear" />
        {view}
      </div>
    );
  }
  if (success === 1) {
    totale = (
      <div className="appFooter full">
        <div className="clear" />
        <div className="success">
          <div className="success-icon-container animated tada">
            <i className="fa fa-check" />
          </div>
          <p className="testo-scuccess">{settings.testo_success}</p>
          <p>
            Il tuo codice ordine è: <strong>#{orderNumber}</strong>
          </p>
        </div>
      </div>
    );
  }
  if (success === -1) {
    totale = (
      <div className="appFooter full">
        <div className="clear" />
        <div className="success">
          <div className="success-icon-container animated tada error">
            <i className="fa fa-times" />
          </div>
          <p className="testo-scuccess">C'è stato un problema</p>
          <p>: (</p>
          <button
            className="btn"
            onClick={() => {
              setSuccess(0);
              changeStep(false);
            }}
          >
            Indietro
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="App">
      <div className="appContainer">
        <h1>
          <img
            className="logo"
            alt={settings.title}
            src={`${baseUrl}img/original/${settings.logo}`}
          />
        </h1>
        <h2>{settings.motto}</h2>

        <div className={"productContainer step-" + step}>
          {menu.map((item, index2) => {
            return (
              <Lista
                key={item.ID}
                product={item}
                f={{ addToCart, removeToCart, toggleDescription }}
              />
            );
          })}
        </div>
        {totale}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
