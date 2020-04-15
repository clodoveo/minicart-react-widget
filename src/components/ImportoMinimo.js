import React from "react";

const ImportoMinimo = props => {
  const { settings } = props;
  window.navigator.vibrate([100, 30, 100]);
  return (
    <div className="minimo-ordine animated headShake">
      Impoto minimo carrello: {settings.importo_minimo} €
    </div>
  );
};

export default ImportoMinimo;
