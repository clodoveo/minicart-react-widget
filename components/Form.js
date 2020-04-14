import React from "react";

const Form = props => {
  const { handleSubmit, userdata, setUserdata } = props;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <p>
            <label>Nome:</label>
            <input
              type="text"
              name="nome"
              required
              value={userdata.nome}
              onChange={e => {
                setUserdata({ ...userdata, nome: e.target.value });
              }}
            />
          </p>
          <p>
            <label>Indirizzo:</label>
            <input
              type="text"
              name="indirizzo"
              required
              value={userdata.indirizzo}
              onChange={e => {
                setUserdata({ ...userdata, indirizzo: e.target.value });
              }}
            />
          </p>
          <p>
            <label>Telefono:</label>
            <input
              type="tel"
              name="telefono"
              required
              value={userdata.telefono}
              onChange={e => {
                setUserdata({ ...userdata, telefono: e.target.value });
              }}
            />
          </p>
          <p>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              value={userdata.email}
              onChange={e => {
                setUserdata({ ...userdata, email: e.target.value });
              }}
            />
          </p>
          <p>
            <label>NOTE :</label>
            <textarea
              name="note"
              onChange={e => {
                setUserdata({ ...userdata, note: e.target.value });
              }}
              value={userdata.note}
            />
          </p>
        </div>
        <button
          className="btn btn-right"
          onClick={() => {
            // changeStep(true);
          }}
          type="submit"
        >
          Procedi
        </button>
      </form>
    </div>
  );
};

export default Form;
