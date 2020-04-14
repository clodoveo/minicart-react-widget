import React from "react";

const Indicator = props => {
  const { q } = props;
  return q > 0 ? <span className="indicator">{q}</span> : "";
};

export default Indicator;
