import React, { useState } from "react";
const AnimatedLabel = ({ text }) => {
    return (
        <label className="label">
            {text.split('').map((char, index) => (
                <span className="label-char" style={{ '--index': index }} key={index}>
                    {char}
                </span>
            ))}
        </label>
    );
};
export const RegisterUser = ({ onRegisterUser }) => {
    const [value, setValue] = useState({});

    const onFormSubmit = e => {
        e.preventDefault();
        onRegisterUser(value);
        setValue({});
    };

    return (
        <div className="Register-user">
            <form onSubmit={onFormSubmit}>
                <h2>User Registration</h2>
                <div className="wave-group">
                    <input className="input" placeholder="Insert name" onChange={(e) => setValue({ ...value, name: e.target.value })}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Name" />
                </div>
                <div className="wave-group">
                    <input className="input" type="email" placeholder="Insert email" onChange={(e) => setValue({ ...value, email: e.target.value })}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Email" />
                </div>
                <div className="wave-group">
                    <input className="input" type="number" placeholder="Insert tipoUsuario" onChange={(e) => setValue({ ...value, tipoUsuario: parseInt(e.target.value) || '' })}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Tipo usuario" />
                </div>
                <div className="wave-group">
                    <input className="input" placeholder="Insert imageURI" onChange={(e) => setValue({ ...value, imageURI: e.target.value })}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Avatar" />
                </div>
                <button type="submit" >Register User</button>
            </form>
        </div>
    );
};
