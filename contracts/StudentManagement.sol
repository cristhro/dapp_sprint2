// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract StudentManagment {

     struct Student {
        string name;
        string email;
        uint dateOfBirth;
    }

    mapping(address => Student) public students;

    function registerStudent( string memory _name, string memory _email, uint _dateOfBirth) public {
        require(students[msg.sender].dateOfBirth == 0, "Student already registered.");
        students[msg.sender] = Student(_name, _email, _dateOfBirth);
    }

    function updateStudentEmail( string memory _newEmail) public {
        require(students[msg.sender].dateOfBirth != 0, "Student not registered.");
        students[msg.sender].email = _newEmail;
    }
}