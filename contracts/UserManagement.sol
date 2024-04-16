// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract UserManagment {

    struct User {
        string name;
        string email;
        uint8 tipoUsuario; // 1: Alumno, 2: Empresa, 3: Instructor, 4: Administrador
        string imageURI;
        bool isActive;
    }
    
    // Mapping para almacenar usuarios por ID
    mapping(address => User) private users;

    // Evento para notificar el registro de un nuevo usuario
    event UserRegistered(string name, string email, uint8 tipoUsuario);

    // Evento para notificar la actualización de datos de un usuario
    event EmailUpdated(string oldEmail, string newEmail);

    function registerUser( string memory _name, string memory _email, uint8 _tipoUsuario, string memory _imageURI) public {
        require(users[msg.sender].tipoUsuario == 0, "User already registered.");
        users[msg.sender] = User(_name, _email, _tipoUsuario, _imageURI, false);
        emit UserRegistered(_name, _email, _tipoUsuario );
    }

    function updateUserEmail( string memory _newEmail) public {
        require(users[msg.sender].tipoUsuario != 0, "User not registered.");
        users[msg.sender].email = _newEmail;
    }

    // Función para obtener los datos de un usuario
    function getUser() public view returns (User memory) {
        require(users[msg.sender].tipoUsuario != 0, "El usuario no existe");
        return users[msg.sender];
    }

    // Función para actualizar los datos de un usuario
    function actualizarUsuario(string memory newEmail) public {
        require(users[msg.sender].tipoUsuario != 0, "El usuario no existe");
        
        User storage user = users[msg.sender];
        emit EmailUpdated(user.email, newEmail);
        user.email = newEmail;
    }
}