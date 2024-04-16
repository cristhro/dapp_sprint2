// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract UserManagment {

    struct User {
        string name;
        string email;
        uint8 tipoUsuario; // 1: Alumno, 2: Empresa, 3: Instructor, 4: Administrador
    }

    mapping(address => User) private users;

    function registerUser( string memory _name, string memory _email, uint8 _tipoUsuario) public {
        require(users[msg.sender].tipoUsuario == 0, "User already registered.");
        users[msg.sender] = User(_name, _email, _tipoUsuario);
    }

    function updateUserEmail( string memory _newEmail) public {
        require(users[msg.sender].tipoUsuario != 0, "User not registered.");
        users[msg.sender].email = _newEmail;
    }
}