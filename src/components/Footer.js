import React from "react";
import Wizard from "./Wizard";
import ImportoMinimo from "./ImportoMinimo";

const Footer = props => {
  const {
    success,
    setSuccess,
    step,
    changeStep,
    calculatePrice,
    settings,
    orderNumber,
    paymentType,
    userdata,
    setUserdata,
    inviaOrdine,
    handleSubmit,
    goToPaypal,
    goToBonifico,
    goTocash
  } = props;

  var bottoneTotaleProcedi = "";
  if (step === 0 && parseFloat(settings.importo_minimo) <= calculatePrice()) {
    bottoneTotaleProcedi = (
      <button className="btn btn-right" onClick={() => changeStep(true)}>
        Procedi
      </button>
    );
  } else if (
    step === 0 &&
    parseFloat(settings.importo_minimo) > calculatePrice()
  ) {
    bottoneTotaleProcedi = <ImportoMinimo settings={settings} />;
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

  if (success === 1) {
    return (
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
    return (
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

  if (calculatePrice() > 0) {
    return (
      <div className="appFooter">
        <div className="tot">
          <span className="">Totale: </span>
          <span className="tot-price">
            €{" "}
            {parseFloat(calculatePrice()) +
              parseFloat(settings.spese_spedizione)}
          </span>
          {settings.spese_spedizione != "" &&
          settings.spese_spedizione != 0.0 ? (
            <small>
              {" "}
              <br />
              (Carrello {calculatePrice()} € + Spese spedizione{" "}
              {settings.spese_spedizione} €)
            </small>
          ) : (
            <></>
          )}
        </div>
        {bottoneTotaleProcedi}
        <div className="clear" />
        <Wizard
          paymentType={paymentType}
          step={step}
          userdata={userdata}
          setUserdata={setUserdata}
          settings={settings}
          inviaOrdine={inviaOrdine}
          handleSubmit={handleSubmit}
          goToPaypal={goToPaypal}
          goToBonifico={goToBonifico}
          goTocash={goTocash}
          calculatePrice={calculatePrice}
        />
      </div>
    );
  } else {
    return <></>;
  }
};
export default Footer;
