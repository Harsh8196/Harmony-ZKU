# Final Project- ZKPayroll
## ZKPayroll system for Web3 Community
ZK Payroll is a payroll platform for growing the web3.0 community.ZK Payroll is used to protect the privacy of employees by using Zero Knowledge.

## The Problem
In the traditional web3.0 payroll system , user information is publicly available like how much wage an employee earns at a given point of time.

## The Solution
ZK Payroll is used to protect employee privacy.The employees generate ‘commitment’ by providing secret and employee code.This commitment stores on blockchain. HR will provide withdrawal notes to employees and employees can withdraw their wage by providing commitment and notes to their desired account. Employees claim their portion of the wage by providing a ZK-proof that they belong in the merkle tree. This way ZK Payroll protects the privacy of employees. So no one can know how much employees earn.

Note: Currently this demo is only for POC. In future will incorporate new feature.

## Technology Used
Semaphore protocol for employee privacy.

## Steps to use ZKPayroll

1. ZKPayroll admin register employer.
2. Employer provide commitment and stored on blockchain.
3. Employer add employee in ZKPayroll system.
4. Employer add fund into ZKPayroll.
5. Employee provide commitment and stored on blockchain.
6. Employer generate notes and share with employee
7. Employee withdraw notes to payout account.
