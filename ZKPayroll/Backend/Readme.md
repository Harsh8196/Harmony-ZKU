# Final Project- ZKPayroll
## ZKPayroll system for Web3 Community
ZK Payroll is a payroll platform for growing the web3.0 community.ZK Payroll is used to protect the privacy of employees by using Zero Knowledge.

## The Problem
In the traditional web3.0 payroll system , user information is publicly available like how much wage an employee earns at a given point of time.

## The Solution
ZK Payroll is used to protect employee privacy.The employees generate ‘commitment’ by providing secret and employee code.This commitment stores on blockchain. HR will provide withdrawal notes to employees and employees can withdraw their wage by providing commitment and notes to their desired account. Employees claim their portion of the wage by providing a ZK-proof that they belong in the merkle tree. This way ZK Payroll protects the privacy of employees. So no one can know how much employees earn.

Note: Currently this demo is only for POC. In future will incorporate new feature.

## Technology Used
### Semaphore protocol 2.0 used for employee privacy

## Testnet Contract Address
0x6999bA844230435e15cC31d9251577dAeEb9fD35

## Mainnet Contract Address
0x9BBB0C1f4C088260B368277fBC161Aac93e1c21c

## Demo UI
https://glowing-dusk-2b3656.netlify.app/

## Demo Video
https://drive.google.com/file/d/1lK1xhByzOAG7O6e3YbLR9iK_QYZgxkjq/view?usp=sharing

## Steps to use ZKPayroll

1. ZKPayroll admin register employer.
2. Employer provide commitment and stored on blockchain.
3. Employer add employee in ZKPayroll system.
4. Employer add fund into ZKPayroll.
5. Employee provide commitment and stored on blockchain.
6. Employer generate notes and share with employee
7. Employee withdraw notes to payout account.
