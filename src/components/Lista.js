import React from "react";
import Indicator from "./Indicator";

const Lista = props => {
  const inputRef = React.createRef(null);
  const { product, f, baseUrl, addMenuNote } = props;
  let removeBt = "";
  let openClass = "";

  const buttonPositionClass = product.descriptionVisible ? "cardOpen" : "";
  const buttonPositionClassMoreThanZero = product.q > 0 ? "moreThenZero" : "";

  if (product.q > 0) {
    removeBt = (
      <button className="remove" onClick={() => f.removeToCart(product.ID)}>
        <i className="fa fa-minus" />
      </button>
    );
    if (!product.descriptionVisible) {
      openClass = "open";
    }
  }

  let description = "";
  let priceCardClass = "";

  let fotoImg = "";

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
        <div className="descriptionText">{product.descrizione}</div>
      </div>
    );
    priceCardClass = "card";
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
      <div className={"prices " + priceCardClass}>€ {product.prezzo}</div>
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
      {product.q > 0 ? (
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
      ) : (
        <></>
      )}
      <div className="clearer" />
    </div>
  );
};

export default Lista;
