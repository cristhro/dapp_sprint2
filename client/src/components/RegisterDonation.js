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
export const RegisterDonation = ({ onRegisterDonation }) => {
    const [value, setValue] = useState(0);

    const onFormSubmit = e => {
        e.preventDefault();
        onRegisterDonation(value);
        setValue(0);
    };

    return (
        <div className="Register-donation">
            <form onSubmit={onFormSubmit}>
                <h2>Do Donation</h2>
                <div className="wave-group">
                    <input className="input" type="number" placeholder="Insert Donation" value={value} onChange={(e) => setValue( e.target.value )}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Donation (ETH)" />
                </div>
                <br></br>
                <button disabled={value==0 } type="submit" >Registrar donación</button>
            </form>
        </div>
    );
};
