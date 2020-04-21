import React from "react";

const MetodoPagamento = props => {
  const { settings, f } = props;
  return settings.contanti_attivo === "0" &&
    settings.bonifico_attivo === "0" &&
    settings.contanti_attivo ? (
    <h3>Al momento non si accettano ordini!</h3>
  ) : (
    <div>
      Metodo pagamento:
      <div className="btn-pagaora">
        {settings.paypal_attivo !== "0" ? (
          <button className="btn" onClick={() => f.goToPaypal()}>
            Paypal
          </button>
        ) : (
          ""
        )}
        {settings.bonifico_attivo !== "0" ? (
          <button className="btn" onClick={() => f.goToBonifico()}>
            Bonifico
          </button>
        ) : (
          ""
        )}
        {settings.contanti_attivo !== "0" ? (
          <button className="btn" onClick={() => f.goTocash()}>
            Alla consegna
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default MetodoPagamento;
