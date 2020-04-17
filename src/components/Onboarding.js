import React from "react";

const Onboarding = props => {
  const { settings, menu } = props;
  return (
    <div className="onboarding-overlay">
      <div className="onboarding-overlay-image" />
      {settings.logo != "" ? (
        <div className="cambia-immagine">
          <a
            href="https://admin.minicart.it/#edit/logo/"
            className="onboarding-buttons"
          >
            1. Cambia il tuo logo
          </a>
        </div>
      ) : (
        ""
      )}
      {menu.length < 1 ? (
        <div className="aggiungi-prodotti">
          <a
            href="https://admin.minicart.it/#new/prodotti"
            className="onboarding-buttons"
          >
            2. Inserisci i tuoi prodotti
          </a>
        </div>
      ) : (
        ""
      )}
      {settings.paypal || settings.bonifico || settings.contanti ? (
        ""
      ) : (
        <div className="aggiungi-pagamento">
          <a
            href="https://admin.minicart.it/#edit/settings/payment"
            className="onboarding-buttons"
          >
            3. Scegli un metodo di pagamento
          </a>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
