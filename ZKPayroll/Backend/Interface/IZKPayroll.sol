// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IZKPayroll {
    enum employeeState {
        deactive,
        active
    }

    enum employerState {
        deactive,
        active
    }

    struct employer {
        uint256 employerCommitment;
        uint256 employerId;
        employerState state;
        bool commitmentCheck;
    }

    struct employee {
        uint256 employeeCommitment;
        uint256 employeeId;
        uint256 employerId;
        string employeeName;
        employeeState state;
        bool commitmentCheck;
    }

    event employerCreated(address _employerAddress);

    event employeeCreated(string _employeeName,uint256 _employeeId);

    event noteCreated(uint256 _note);

    function createEmployer(address _employerAddress) external;

    function addEmployee(string memory _employeeName) external;

    function addEmployerCommitment(uint256 _commitment) external;

    function addEmployeeCommitment(uint256 _commitment,uint256 _id) external;

    function getEmployeeIdList() external view returns(uint256[] memory _employeeIdList);

    function getEmployerList() external view returns (address[] memory _employerList);

    function getEmployerLeaves(uint256 _employerId) external view returns(uint256[] memory _employerLeaves);

    function getEmployeeEmployerId(uint256 _id) external view returns(uint256 _employerId);


    function getEmployeeDetails(uint256 _id) external view returns(string memory _employeeName, employeeState _state,uint256 _employerId,uint256 _employeeCommitment);

    function addfundToContract() external payable;

    function getAvailableFund() external returns(uint256 _value);

    function addNotes(uint256 _employeeId,uint256 _salary, uint256 _receivedCommitment,uint256 _identityCommitment)external;

    function withdrawNotes(uint256 _withdrawalNotes,address payable _withdrawalAddress , bytes32 withdraw, uint256 nullifierHash, uint256 employerId, uint256[8] calldata proof) external;

    
}