import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import './App.css';

function Modal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

function App() {
  const [nombre, setNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');
  const [entidadNacimiento, setEntidadNacimiento] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nombre || !primerApellido || !fechaNacimiento || !sexo || !entidadNacimiento) {
      setModalMessage("Por favor, complete todos los campos.");
      setIsModalOpen(true);
      return;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fechaNacimiento)) {
      setModalMessage("Formato de fecha de nacimiento inválido. Use el formato dd/mm/aaaa.");
      setIsModalOpen(true);
      return;
    }

    if (!captchaToken) {
      alert("Por favor, complete el captcha.");
      return;
    }

    const formData = {
      nombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      fecha_nac: fechaNacimiento,
      sexo: sexo === "hombre" ? "H" : "M",
      entidad: entidadNacimiento,
      captcha: captchaToken
    };

    const raw = JSON.stringify(formData);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: raw,
      redirect: "follow"
    };

    fetch("http://127.0.0.1:5000/curp", requestOptions)
      .then(response => response.text())
      .then(result => {
        setModalMessage(result);
        setIsModalOpen(true);
      })
      .catch(error => {
        setModalMessage(`Error: ${error.toString()}`);
        setIsModalOpen(true);
      });
  };


  const onChange = (token) => {
    setCaptchaToken(token);
  };

  return (
    <>
      <h2 className="titulo text-center">CURP</h2>
      <form onSubmit={handleSubmit} className="formulario container">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="form-control" id="nombre" />
        </div>
        <div className="mb-3">
          <label htmlFor="primerApellido" className="form-label">Primer Apellido:</label>
          <input type="text" value={primerApellido} onChange={e => setPrimerApellido(e.target.value)} className="form-control" id="primerApellido" />
        </div>
        <div className="mb-3">
          <label htmlFor="segundoApellido" className="form-label">Segundo Apellido:</label>
          <input type="text" value={segundoApellido} onChange={e => setSegundoApellido(e.target.value)} className="form-control" id="segundoApellido" />
        </div>
        <div className="mb-3">
          <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento:</label>
          <input type="text" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} className="form-control" id="fechaNacimiento" />
        </div>
        <div className="mb-3">
          <label htmlFor="sexo" className="form-label">Sexo:</label>
          <select value={sexo} onChange={e => setSexo(e.target.value)} className="form-select" id="sexo">
            <option value="">Seleccione...</option>
            <option value="mujer">Mujer</option>
            <option value="hombre">Hombre</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="entidadNacimiento" className="form-label">Entidad de Nacimiento:</label>
          <input type="text" value={entidadNacimiento} onChange={e => setEntidadNacimiento(e.target.value)} className="form-control" id="entidadNacimiento" />
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
        <div className="captcha-container text-center">
        <ReCAPTCHA
          sitekey="6LfKE7QpAAAAALbV94lNY5FmJHhp2wDXosQ7k4Bn"
          onChange={onChange}
        />
      </div>
      </form>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={modalMessage} />
    </>
  );
}

export default App;
