import React from "react";

import Form from "./Form";
import MetodoPagamento from "./MetodoPagamento";
import { PayPalButton } from "react-paypal-button-v2";

const Wizard = props => {
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
    calculatePrice
  } = props;

  if (step === 1) {
    return (
      <Form
        handleSubmit={handleSubmit}
        userdata={userdata}
        setUserdata={setUserdata}
      />
    );
  } else if (step === 2) {
    return (
      <MetodoPagamento
        f={{ goToPaypal, goToBonifico, goTocash }}
        settings={settings}
      />
    );
  } else if (paymentType === "cash" && step === 3) {
    return (
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
  } else if (paymentType === "bonifico" && step === 3) {
    return (
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
  } else if (paymentType === "paypal" && step === 3) {
    return (
      <div className="paypal">
        <h3>Paga ora:</h3>
        <PayPalButton
          amount={parseFloat(
            calculatePrice() + parseFloat(settings.spese_spedizione)
          )}
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
  } else {
    return <></>;
  }
};
export default Wizard;
