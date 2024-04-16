// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract StudentManagment {

     struct Student {
        string name;
        string email;
        uint dateOfBirth;
    }

    mapping(uint => Student) public students;

    function registerStudent(uint _studentId, string memory _name, string memory _email, uint _dateOfBirth) public {
        require(students[_studentId].dateOfBirth == 0, "Student already registered.");
        students[_studentId] = Student(_name, _email, _dateOfBirth);
    }

    function updateStudentEmail(uint _studentId, string memory _newEmail) public {
        require(students[_studentId].dateOfBirth != 0, "Student not registered.");
        students[_studentId].email = _newEmail;
    }

}