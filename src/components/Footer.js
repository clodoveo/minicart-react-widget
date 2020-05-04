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
    goTocash,
    getSpeseSpedizione,
    modalitaConsegna,
    setModalitaConsegna
  } = props;

  var bottoneTotaleProcedi = "";
  if (step === 0) {
    bottoneTotaleProcedi = (
      <>
        {settings.asporto_attivo==1 ? (
          <button
            className="btn btn-right"
            onClick={() => {
              setModalitaConsegna("Ritiro in negozio");
              changeStep(true);
            }}
          >
            Ritira in negozio
            <span>(Takeaway)</span>
          </button>
        ) : (
          ""
        )}
        {settings.delivery_attivo==1 ? (
          <button
            disabled={
              parseFloat(settings.importo_minimo) > parseFloat(calculatePrice())
                ? true
                : false
            }
            className={`btn btn-right`}
            onClick={() => {
              setModalitaConsegna("Delivery");
              changeStep(true);
            }}
          >
            Delivery
            {parseFloat(settings.importo_minimo) >
              parseFloat(calculatePrice()) ||
            getSpeseSpedizione(calculatePrice()) > 0.0 ? (
              <span>
                (
                {getSpeseSpedizione(calculatePrice()) > 0.0
                  ? `+ ${parseInt(settings.spese_spedizione)} €`
                  : " Spedizione gratuita!"}{" "}
                {parseFloat(settings.importo_minimo) >
                parseFloat(calculatePrice())
                  ? `Spesa min. ${parseInt(settings.importo_minimo)} €)`
                  : ")"}
              </span>
            ) : (
              <span>
                {""}
                (Consegna gratuita!)
              </span>
            )}
          </button>
        ) : (
          ""
        )}
        <div class="clearer" />
      </>
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

  if (calculatePrice() > 0 && step == 0) {
    return (
      <div className="appFooter">
        <div className="tot">
          <span className="">Totale carrello: </span>
          <span className="tot-price">€ {parseFloat(calculatePrice())}</span>
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
          getSpeseSpedizione={getSpeseSpedizione}
          changeStep={changeStep}
        />
      </div>
    );
  } else if (step > 0) {
    console.log(modalitaConsegna);
    let speseSped = "";
    if (modalitaConsegna != "Ritiro in negozio") {
      if (getSpeseSpedizione(calculatePrice()) > 0.0 && step > 0) {
        speseSped = `( + Spese spedizione ${getSpeseSpedizione(
          calculatePrice()
        )}
      €)`;
      } else {
        speseSped = `(Carrello ${calculatePrice()} € + Spedizione gratuita! )`;
      }
    }
    return (
      <div className="appFooter">
        <div className="tot">
          <span className="">Totale carrello: </span>
          <span className="tot-price">€ {parseFloat(calculatePrice())}</span>

          <p>
            {speseSped}
            <br />
          </p>
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
          getSpeseSpedizione={getSpeseSpedizione}
          modalitaConsegna={modalitaConsegna}
          changeStep={changeStep}
        />
      </div>
    );
  } else {
    return <></>;
  }
};
export default Footer;
