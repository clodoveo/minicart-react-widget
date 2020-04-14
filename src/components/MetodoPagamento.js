import React from "react";

const MetodoPagamento = props => {
  const { settings, f } = props;
  return (
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
            Contanti
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default MetodoPagamento;
