// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract WorkEx {

  address payable public contractCreator;

  uint256 expCount;

  mapping(address => Employee) employeeMapping;   // employeePublicKey -> Employee Struct
  mapping(address => Employer) employerMapping;   // employerPublicKey -> Employer Struct
  mapping(address => uint256[])   expEmployee    ;   // employeePublicKey -> Exp Struct list

  enum ExperienceStatus { PENDING, APPROVED, REJECTED }

  // for employer
  mapping(address => uint256[]) expEmployer;

  mapping(uint => Exp) expArray;

  constructor() {
    contractCreator = payable(msg.sender);
    expCount = 0;
  }

  struct Exp {
    uint256 _expId; // set automatically
    address _employeePublicKey;
    string  _employeeId;
    string  _projectTitle;
    string  _designation;
    uint32  _salary;
    string _startDate;
    string _endDate;
    address _employerPublicKey;
    ExperienceStatus _status;
    string _employerComments;
    string _employeeComments;
  }

  struct Employer {
    address _publicKey;
    uint256 _id; // unique
    string  _name;
    string  _address;
    string  _url;
    uint32  _phoneNumber;
  }

  struct Employee {
    address _publicKey;
    string  _name;
    uint256 _id; // unique
    string  _address;
    uint32  _phoneNumber;
  }

  event notifyEmployer(address _employer, Exp _experience);

  // add employer
  function addEmployerDetails(Employer memory _employer) public payable {
    require(msg.sender == _employer._publicKey, "msg.sender should be the same as the employer");

    employerMapping[msg.sender] = _employer;
  }

  // add employee
  function addEmployeeDetails(Employee memory _employee) public payable {
    require(msg.sender == _employee._publicKey, "msg.sender should be the same as the employee");

    employeeMapping[msg.sender] = _employee;
  }

  // employee adds his experience
  function addExperience(Exp memory _experience) public payable {
    require(msg.sender == _experience._employeePublicKey, "msg.sender should be the same as the experience._employeePublicKey");

    _experience._expId = expCount;
    _experience._status = ExperienceStatus.PENDING;
    expArray[expCount] = _experience;

    expEmployee[_experience._employeePublicKey].push(expCount);
    expEmployer[_experience._employerPublicKey].push(expCount);

    expCount++;
    emit notifyEmployer(_experience._employerPublicKey, _experience);
  }

  // employer approves/rejects an employee's experience
  function approveExperience(uint256 _expId, string memory _comments) public payable {
    require(msg.sender == expArray[_expId]._employerPublicKey, "msg.sender should be the employer mentioned in the experience");

    expArray[_expId]._status = ExperienceStatus.APPROVED;
    expArray[_expId]._employerComments = _comments;
  }

  // employer approves/rejects an employee's experience
  function rejectExperience(uint256 _expId, string memory _comments) public payable {
    require(msg.sender == expArray[_expId]._employerPublicKey, "msg.sender should be the employer mentioned in the experience");

    expArray[_expId]._status = ExperienceStatus.REJECTED;
    expArray[_expId]._employerComments = _comments;
  }

  function getEmployeeDetails(address _employeePublicKey) public view returns(Employee memory) {
    return employeeMapping[_employeePublicKey];
  }

  function getEmployerDetails(address _employerPublicKey) public view returns(Employer memory) {
    return employerMapping[_employerPublicKey];
  }

  function getExperienceDetailsForEmployee(address _employeePublicKey) public view returns(Exp[] memory) {

    uint256[] storage employeeExperienceIds = expEmployee[_employeePublicKey];
    Exp[] memory employeeExperiences = new Exp[](employeeExperienceIds.length);

    for(uint256 i = 0; i<employeeExperienceIds.length; i++) {
      employeeExperiences[i] = expArray[employeeExperienceIds[i]];
    }
    return employeeExperiences;
  }

  function getExperienceDetailsForEmployer(address _employerPublicKey) public view returns(Exp[] memory) {
    require(msg.sender == _employerPublicKey, "msg.sender should be the one asking for employer experiences");

    uint256[] storage employerExperienceIds = expEmployer[_employerPublicKey];
    Exp[] memory employerExperiences = new Exp[](employerExperienceIds.length);


    for(uint256 i = 0; i<employerExperienceIds.length; i++) {
      employerExperiences[i] = expArray[employerExperienceIds[i]];
    }
    return employerExperiences;
  }

  function getAllExperiences(address _employerPublicKey) public view returns(Exp[] memory) {
    require(msg.sender == _employerPublicKey, "msg.sender should be the one asking for employer experiences");

    Exp[] memory allExperiences = new Exp[](expCount);

    for (uint256 i = 0; i < expCount; i++) {
      allExperiences[i] = expArray[i];
    }

    return allExperiences;
  }
}
