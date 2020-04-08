import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { PayPalButton } from "react-paypal-button-v2";
import "./styles.css";

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
const pv = getParameterByName("pv") ? getParameterByName("pv") : "2";
//console.log(pv);

const Lista = props => {
  const { product, f } = props;
  let removeBt = "";
  if (product.q > 0) {
    removeBt = (
      <button className="remove" onClick={() => f.removeToCart(product.ID)}>
        -
      </button>
    );
  }

  return (
    <div className="products">
      {product.title} <div className="prices">€ {product.prezzo}</div>
      <div className="description">{product.descrizione}</div>
      <div className="buttons">
        {removeBt}
        <Indicator q={product.q}> </Indicator>
        <button className="add" onClick={() => f.addToCart(product.ID)}>
          +
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
          "https://minicart.it/api/ordini/settings/" + pv + "/"
        );

        const jsonSettings = await settings.json();

        setSettings(jsonSettings);

        const response = await fetch(
          "https://minicart.it/api/ordini/menu/" + pv + "/"
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
    note: ""
  };

  const [settings, setSettings] = useState({});
  const [menu, setMenu] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [step, setStep] = useState(0);
  const [userdata, setUserdata] = useState(emtyForm);
  const [success, setSuccess] = useState(0);

  const addToCart = index => {
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
    console.log(userdata);
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
    const res = await postData(
      "https://minicart.it/api/ordini/new/" + pv + "/",
      {
        menu: menu,
        userdata: userdata
      }
    );
    const result = await res;
    //console.log(result);
    if (result.success === true) {
      setSuccess(1);
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
            postData(
              "https://www.le-papere.it/api/ordini/callback/",
              menu
            ).then(data => {
              console.log(data.json()); // JSON data parsed by `response.json()` call
            });
          }}
          options={{
            clientId:
              "AfRvw-D30X1sihKsA7qoh6Hqd31XZh4rH3wmb41J9g7HLgJ0w2MCsG2nAxuPrLcGIyjHhHhYW6ZEBV-W",
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
          <label>
            per faicilitare il resto dimmi con che talgi di banconote paghi (es:
            50 €):
          </label>
          <input type="email" name="noteContanti" />
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
        <>
          <label>
            <p>
              la preghiamo di effettuare il pagamento al seguente IBAN:
              <strong>IT1234567891011</strong>
            </p>
            <p>
              La spedizione avverà nelle 24 ore dalla ricezione del pagamento
            </p>
          </label>
        </>
        <button className="btn btn-invia" type="submit">
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
      <>
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
      </>
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
      <div className="appFooter">
        <div className="clear" />
        <div className="success">
          <div className="success-icon-container animated tada">
            <i className="fa fa-check" />
          </div>
          <p className="testo-scuccess">
            Grazie il tuo ordine è stato inoltrato
          </p>
          <p>Riceverai una emai di conferma</p>
        </div>
      </div>
    );
  }
  return (
    <div className="App">
      <h1>
        <img
          className="logo"
          alt={settings.title}
          src={`https://minicart.it/img/original/${settings.logo}`}
        />
      </h1>
      <h2>{settings.motto}</h2>

      <div className="productContainer">
        {menu.map((item, index2) => {
          return (
            <Lista
              key={item.ID}
              product={item}
              f={{ addToCart, removeToCart }}
            />
          );
        })}
      </div>
      {totale}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
