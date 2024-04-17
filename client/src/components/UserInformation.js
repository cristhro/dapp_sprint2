import React from "react";


export const UserInformation = ({ user }) => {
    return (
        <div className="User-information">
            <h2>User Information</h2>

            {/* User Image */}
            <div className="User-information-img">
                {user.imageURI && <img src={user.imageURI}></img>}
            </div>
            {/* User information */}
            <div className="User-information-text">
                <p><b>User Name:</b> {user.name}</p>
                {/* <p><b>Active: </b>{user.isActive ? "The user is still active!! 🤩 🤩" : "The user is not longer active 😭 😭"}</p> */}
                <p><b>User Type:</b> {parseTipoUsuario(user.tipoUsuario)}</p> 
            </div>
        </div>
    );

    function parseTipoUsuario(tipoUsuario) {
        console.log('🚀 ~ parseTipoUsuario ~ tipoUsuario:', tipoUsuario)
        switch (+tipoUsuario) {
            case 1:
                return "Alumno";
            case 2:
                return "Empresa";
            case 3:
                return "Instructor";
            case 4:
                return "Administrador";
            default:
                return "Unknown";
        }
    }
};