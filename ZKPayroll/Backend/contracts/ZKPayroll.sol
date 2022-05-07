// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@appliedzkp/semaphore-contracts/base/SemaphoreCore.sol";
import "@appliedzkp/semaphore-contracts/base/SemaphoreGroups.sol";
import "../Interface/IZKPayroll.sol";


contract ZKPayroll is IZKPayroll,SemaphoreCore,SemaphoreGroups {

//  IVerifier public verifiers;

struct listOfemployees{

    uint256[] employeeId;
}

struct listOfLeaves{

    uint256[] leaves;
}

mapping(uint8 => IVerifier) internal verifiers;

address[] listOfEmployer;

mapping(uint256 => listOfLeaves) employerToLeaves;

mapping(uint256 => employee) idToemployee;

mapping(address => employer)  public addressToemployer;

mapping(address => listOfemployees) addressToemployees;

mapping(address => uint256) addressTofundValue;

mapping(uint256 => uint256) notesTosalary;

uint256 public employerCount;
uint256 public employeesCount;

uint256 public _hash;

address admin;

constructor(address _verifiersAddress) {

   admin = msg.sender;
   verifiers[20] = IVerifier(_verifiersAddress);

  }

modifier onlyAdmin(address _sender) {
    require(admin == _sender,"Sender is not Admin.");
    _;
}

modifier onlyEmployer(address _sender) {
    require(addressToemployer[_sender].state == employerState.active, "Employer is not active");
    _;
}

//for testing any one can register employer
//On mainnet only Admin can register employer
function createEmployer(address _employerAddress) public override onlyAdmin(msg.sender){

    employerCount += 1 ;

    _createGroup(employerCount, 20, 0);

    employer memory _employer;

    _employer.employerId = employerCount;

    _employer.state = employerState.active;

    _employer.commitmentCheck = false;

    addressToemployer[_employerAddress] = _employer;

    listOfEmployer.push(_employerAddress);

    emit employerCreated(_employerAddress);
}

function addEmployerCommitment(uint256 _commitment) public override onlyEmployer(msg.sender){

    require(addressToemployer[msg.sender].commitmentCheck == false,"Already updated commitment");

    addressToemployer[msg.sender].employerCommitment = _commitment;

    addressToemployer[msg.sender].commitmentCheck = true;

}

function addEmployee(string memory _employeeName) public override onlyEmployer(msg.sender)  {

    require(keccak256(abi.encodePacked(_employeeName)) != keccak256(abi.encodePacked("")),"Please Enter employeeName");

    employee memory _addemployee;

    employeesCount += 1;

    _addemployee.employeeId = employeesCount;

    _addemployee.employeeName = _employeeName;

    _addemployee.state = employeeState.active;

    _addemployee.employerId = addressToemployer[msg.sender].employerId;

    _addemployee.commitmentCheck = false;

    addressToemployees[msg.sender].employeeId.push(employeesCount);

    idToemployee[employeesCount] = _addemployee;

    emit employeeCreated(_employeeName,employeesCount);

}

function addEmployeeCommitment(uint256 _commitment,uint256 _id) public override {

    require(idToemployee[_id].commitmentCheck == false,"Already updated commitment");

    idToemployee[_id].employeeCommitment = _commitment;

    idToemployee[_id].commitmentCheck = true;
}

function getEmployeeIdList() public view override onlyEmployer(msg.sender) returns(uint256[] memory _employeeIdList) {
    return(addressToemployees[msg.sender].employeeId);
}

function getEmployerLeaves(uint256 _employerId) public view override returns(uint256[] memory _employerLeaves) {
    return(employerToLeaves[_employerId].leaves);
}

function getEmployerList() public view override onlyAdmin(msg.sender) returns (address[] memory _employerList) {
    return(listOfEmployer);
}

function getEmployeeDetails(uint256 _id) public view override onlyEmployer(msg.sender) returns(string memory _employeeName, employeeState _state,uint256 _employerId,uint256 _employeeCommitment) {
    employee memory _employeeDetails;
    _employeeDetails = idToemployee[_id];

    return(_employeeDetails.employeeName,_employeeDetails.state,_employeeDetails.employerId,_employeeDetails.employeeCommitment);
}

function getEmployeeEmployerId(uint256 _id) public view override returns(uint256 _employerId){
    employee memory _employeeDetails;
    _employeeDetails = idToemployee[_id];

    return(_employeeDetails.employerId);
}



function addfundToContract() public payable override onlyEmployer(msg.sender) {
    addressTofundValue[msg.sender] += msg.value;
}

function getAvailableFund() public view override onlyEmployer(msg.sender) returns(uint256 _fundValue) {
    return(addressTofundValue[msg.sender]);
}

function addNotes(uint256 _employeeId,uint256 _salary, uint256 _receivedCommitment,uint256 _identityCommitment) public override onlyEmployer(msg.sender){
    employer memory _employer;
    employee memory _employee;
    _employer = addressToemployer[msg.sender];
    _employee = idToemployee[_employeeId];
    uint256 _employerId = _employer.employerId;

    uint256 _fund = addressTofundValue[msg.sender];
    
    require(_employer.employerCommitment == _receivedCommitment,"Employer commitment is not valid.");

    require(_fund >= _salary,"Require fund is not available, Please add fund.");

    _addMember(_employerId, _identityCommitment);
 
    notesTosalary[_identityCommitment] = _salary;

    addressTofundValue[msg.sender] = _fund - _salary;

    employerToLeaves[_employerId].leaves.push(_identityCommitment);

  }

  


  function withdrawNotes(uint256 _withdrawalNotes,address payable _withdrawalAddress,bytes32 withdraw,uint256 nullifierHash,uint256 employerId,uint256[8] calldata proof) public override  {

    
    uint256 root = getRoot(employerId);
    IVerifier verifier = verifiers[20];

    _verifyProof(withdraw, root, nullifierHash, employerId, proof, verifier);

    uint256 _salary = notesTosalary[_withdrawalNotes];

    require(_withdrawalAddress.send(_salary),"Account transfer fail.");

    // Prevent double-voting (nullifierHash = hash(pollId + identityNullifier)).
    _saveNullifierHash(nullifierHash);

  }

}