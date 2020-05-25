import React from "react";

const Separatore = props => {
  const { product, nl2br } = props;
  return (
    <div className="separatoreContainer">
      <h3 className="separatoreContent">{product.title}</h3>
    </div>
  );
};

export default Separatore;
