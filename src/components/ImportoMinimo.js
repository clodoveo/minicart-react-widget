import React from "react";

const ImportoMinimo = props => {
  const { settings } = props;
  // enable vibration support
  navigator.vibrate =
    navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    navigator.msVibrate;

  if (navigator.vibrate) {
    window.navigator.vibrate([100, 30, 100]);
  }

  return (
    <div className="minimo-ordine animated headShake">
      Importo minimo carrello: {settings.importo_minimo} €
    </div>
  );
};

export default ImportoMinimo;
