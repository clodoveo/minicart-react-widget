import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { PayPalButton } from "react-paypal-button-v2";
import "./styles.css";

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
        const response = await fetch(
          "https://www.le-papere.it/api/ordini/menu/"
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

  const [menu, setMenu] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [step, setStep] = useState(0);

  const addToCart = index => {
    let newCart = menu.map(p => {
      //console.log(index);
      return p.ID === index ? { ...p, q: p.q + 1 } : p;
    });
    console.log(newCart);
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

  let totale = "";
  let view = "";

  if (paymentType === "paypal" && step === 3) {
    view = (
      <div className="paypal">
        <h3>paga ora:</h3>
        <PayPalButton
          amount={calculatePrice()}
          // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
          onSuccess={(details, data) => {
            //alert("Transaction completed by " + details.payer.name.given_name);

            console.log(menu);
            // OPTIONAL: Call your server to save the transaction
            postData(
              "https://www.le-papere.it/api/ordini/callback/",
              menu
            ).then(data => {
              console.log(data); // JSON data parsed by `response.json()` call
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
        <button className="btn btn-invia" type="submit">
          INVIA ORDINE
        </button>
      </div>
    );
  }
  if (paymentType === "bonifico" && step === 3) {
    view = (
      <div>
        <p>
          <label>
            <p>
              L'ordine è stato inoltrato . la preghiamo di effettuare il
              pagamento al seguente IBAN:
              <strong>IT1234567891011</strong>
            </p>
            <p>
              La spedizione avverà nelle 24 ore dalla ricezione del pagamento
            </p>
          </label>
        </p>
        <button className="btn btn-invia" type="submit">
          INVIA ORDINE
        </button>
      </div>
    );
  }

  if (step === 1) {
    view = (
      <div>
        <div className="form">
          <p>
            <label>Nome:</label>
            <input type="text" name="nome" />
          </p>
          <p>
            <label>Indirizzo:</label>
            <input type="text" name="indirizzo" />
          </p>
          <p>
            <label>Telefono:</label>
            <input type="tel" name="telefono" />
          </p>
          <p>
            <label>Email:</label>
            <input type="email" name="email" />
          </p>
          <p>
            <label>NOTE :</label>
            <textarea name="note" />
          </p>
        </div>
        <button
          className="btn btn-right"
          onClick={() => {
            changeStep(true);
          }}
          type="submit"
        >
          PROCEDI
        </button>
      </div>
    );
  }
  if (step === 2) {
    view = (
      <p>
        paga ora:
        <button className="btn" onClick={() => goToPaypal()}>
          paypal
        </button>
        <button className="btn" onClick={() => goToBonifico()}>
          Bonifico
        </button>
        <button className="btn" onClick={() => goTocash()}>
          alla consegna in contanti
        </button>
      </p>
    );
  }
  const postData = async (url = "", data = {}) => {
    // Default options are marked with *
    const fd = new FormData();
    fd.append("data", JSON.stringify(menu));
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "omit", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"

        //"Content-Type": "application/x-www-form-urlencoded"
        //"Content-Type": "multipart/form-data"
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: fd //objectToFormData(data) // body data type must match "Content-Type" header
    });
    return response;
  };

  let bottoneTotaleProcedi = "";
  if (step === 0) {
    bottoneTotaleProcedi = (
      <button className="btn btn-right" onClick={() => changeStep(true)}>
        PROCEDI
      </button>
    );
  } else {
    bottoneTotaleProcedi = (
      <button
        className=" btn-right btn-close"
        onClick={() => changeStep(false)}
      >
        X
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
        {view}
      </div>
    );
  }
  return (
    <div className="App">
      <h1>YOUR LOGO HERE</h1>
      <h2>Smart commerce looks great</h2>

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
      {view}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
