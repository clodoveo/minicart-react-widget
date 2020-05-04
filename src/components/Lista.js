import React from "react";
import Indicator from "./Indicator";

const Lista = props => {
  const inputRef = React.createRef(null);
  const { product, f, baseUrl, addMenuNote, nl2br } = props;
  let removeBt = "";
  let openClass = "";

  const buttonPositionClass = product.descriptionVisible ? "cardOpen" : "";
  const buttonPositionClassMoreThanZero = product.q > 0 ? "moreThenZero" : "";

  let description = "";
  let priceCardClass = "";

  let fotoImg = "";

  let iconaImmagine = "";
  let indicatoreDettagli = "";
  let noteRiga = "";


  if (product.foto != "" && product.foto.indexOf("https") > -1) {
    fotoImg = (
      <div className="imgContainer">
        <img
          src={`${product.foto}`}
          style={{ maxWidth: "100%" }}
          alt={product.title}
        />
      </div>
    );

    iconaImmagine = <i className="fa fa-image icona-immagine" />;
    indicatoreDettagli = (
      <i className="fas fa-chevron-down indicatore-dettagli" />
    );

  } else if (product.foto != "") {
    fotoImg = (
      <div className="imgContainer">
        <img
          src={`${baseUrl}img/original/${product.foto}`}
          style={{ maxWidth: "100%" }}
          alt={product.title}
        />
      </div>
    );
    iconaImmagine = <i className="fa fa-image icona-immagine" />;
    indicatoreDettagli = (
      <i className="fas fa-chevron-down indicatore-dettagli" />
    );
  }

  if (product.descrizione != "") {
    indicatoreDettagli = (
      <i className="fas fa-chevron-down indicatore-dettagli" />
    );
  }

  if (
    (product.descriptionVisible && product.descrizione != "") ||
    (product.descriptionVisible && product.foto != "")
  ) {
    description = (
      <div className={"description animated fadeIn"}>
        <i
          className="fa fa-times closeCard"
          onClick={() => f.toggleDescription(product.ID, inputRef)}
        />
        {fotoImg}
        <div className="descriptionText">{nl2br(product.descrizione)}</div>
      </div>
    );
    priceCardClass = "card";
    indicatoreDettagli = (
      <i className="fas fa-chevron-up indicatore-dettagli" />
    );
  }

  if (product.q > 0) {
    removeBt = (
      <button className="remove" onClick={() => f.removeToCart(product.ID)}>
        <i className="fa fa-minus" />
      </button>
    );
    if (!product.descriptionVisible) {
      openClass = "open";
    }

    noteRiga = (
      <input
        className="noteRiga"
        type="text"
        placeholder="Inserisci qui richieste speciali..."
        value={product.noteRiga}
        name={`noteRiga_${product.ID}`}
        onChange={e => {
          addMenuNote(product.ID, e.target.value);
        }}
      />
    );
    indicatoreDettagli = "";
  }

  return (
    <div className="products" ref={inputRef}>
      <p
        className={`product-title ${openClass} ${buttonPositionClass}`}
        onClick={() => f.toggleDescription(product.ID, inputRef)}
      >
        {product.title}
      </p>{" "}
      {description}
      <div
        className={"prices " + priceCardClass}
        onClick={() => f.toggleDescription(product.ID, inputRef)}
      >
        € {product.prezzo} {iconaImmagine}
        <div className="indicatore-dettagli-container">
          {indicatoreDettagli}
        </div>
      </div>
      <div
        className={`buttons ${buttonPositionClass} ${buttonPositionClassMoreThanZero}`}
      >
        {removeBt}
        <Indicator q={product.q}> </Indicator>
        <button
          className="add"
          onClick={e => {
            f.addToCart(product.ID, e, inputRef);
            //f.toggleDescription(product.ID, inputRef);
          }}
        >
          <i className="fa fa-plus" />
        </button>
      </div>
      {noteRiga}
      <div className="clearer" />
    </div>
  );
};

export default Lista;
