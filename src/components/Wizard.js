import React, { useRef } from "react";

import Form from "./Form";
import MetodoPagamento from "./MetodoPagamento";
import { PayPalButton } from "react-paypal-button-v2";
import ImportoMinimo from "./ImportoMinimo";

const Wizard = props => {
  const btnRef = useRef(null);

  const handleClick = () => {
    btnRef.current.setAttribute("disabled", "disabled");
    console.log("click");
    inviaOrdine();
  };

  const {
    paymentType,
    step,
    userdata,
    setUserdata,
    settings,
    inviaOrdine,
    handleSubmit,
    goToPaypal,
    goToBonifico,
    goTocash,
    calculatePrice,
    prezzo,
    getSpeseSpedizione,
    modalitaConsegna,
    changeStep
  } = props;

  if (step === 1 && settings.data_consegna_attivo == 1) {
    return (
      <>
        <p>{settings.info_data_consegna}</p>
        <input
          type="text"
          name="data_consegna_ritiro"
          value={userdata.note_consegna}
          placeholder="Scrivi qui"
          onChange={e => {
            setUserdata({ ...userdata, note_consegna: e.target.value });
          }}
        />
        <br />
        <br />
        <button
          className="btn btn-right"
          onClick={() => {
            changeStep(true);
          }}
        >
          Procedi
        </button>
      </>
    );
  } else if (step === 1) {
    changeStep(true);
  }

  if (step === 2) {
    return (
      <Form
        handleSubmit={handleSubmit}
        userdata={userdata}
        setUserdata={setUserdata}
        settings={settings}
        calculatePrice={calculatePrice}
        modalitaConsegna={modalitaConsegna}
      />
    );
  } else if (step === 3) {
    return (
      <MetodoPagamento
        f={{ goToPaypal, goToBonifico, goTocash }}
        settings={settings}
      />
    );
  } else if (paymentType === "cash" && step === 4) {
    return (
      <div>
        <p>
          <label>{settings.testo_contanti}</label>
          <input
            type="text"
            placeholder="Scrivi qui"
            name="note_pagamento"
            value={userdata.note_pagamento}
            onChange={e => {
              setUserdata({ ...userdata, note_pagamento: e.target.value });
            }}
          />
        </p>
        {parseFloat(settings.importo_minimo) <= parseFloat(calculatePrice()) ||
        modalitaConsegna == "Ritiro in negozio" ? (
          <button
            ref={btnRef}
            className="btn btn-invia"
            type="submit"
            onClick={handleClick}
          >
            Invia ordine
          </button>
        ) : (
          <ImportoMinimo settings={settings} />
        )}
      </div>
    );
  } else if (paymentType === "bonifico" && step === 4) {
    return (
      <div>
        <p>
          <label>{settings.testo_bonifico}</label>
          <input
            type="text"
            name="note_pagamento"
            placeholder="Scrivi qui"
            value={userdata.note_pagamento}
            onChange={e => {
              setUserdata({ ...userdata, note_pagamento: e.target.value });
            }}
          />
        </p>

        {parseFloat(settings.importo_minimo) <= parseFloat(calculatePrice()) ||
        modalitaConsegna == "Ritiro in negozio" ? (
          <button
            ref={btnRef}
            className="btn btn-invia"
            type="submit"
            onClick={handleClick}
          >
            Invia ordine
          </button>
        ) : (
          <ImportoMinimo settings={settings} />
        )}
      </div>
    );
  } else if (paymentType === "paypal" && step === 4) {
    let importo = parseFloat(
      parseFloat(
        parseFloat(calculatePrice()) +
          parseFloat(getSpeseSpedizione(calculatePrice()))
      ).toFixed(2)
    );
    if (modalitaConsegna == "Ritiro in negozio") {
      importo = parseFloat(parseFloat(calculatePrice()).toFixed(2));
    }
    return (
      <>
        {parseFloat(settings.importo_minimo) <= parseFloat(calculatePrice()) ||
        modalitaConsegna == "Ritiro in negozio" ? (
          <div className="paypal">
            <h3>Paga ora:</h3>
            <PayPalButton
              amount={importo}
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
        ) : (
          <ImportoMinimo settings={settings} />
        )}
      </>
    );
  } else {
    return <></>;
  }
};
export default Wizard;
