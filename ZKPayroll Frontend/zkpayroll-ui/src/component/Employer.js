import React, { useState, useEffect } from 'react'
import Base from './Base'
import '../css/Employer.css'
import ZKPayroll from '../script/ZKPayroll'
import MetaMaskOnboarding from '@metamask/onboarding';
import web3 from "../script/web3_"
import { ZkIdentity, Strategy } from "@zk-kit/identity"



function Admin() {

    const [accounts, setAccounts] = useState('');
    const [employerAddress, setemployerAddress] = useState('');
    const [errorMessage,setErrorMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [employerSecret, setemployerSecret] = useState('')
    const [commitmentStatus, setcommitmentStatus] = useState(false)
    const [employeeName,setemployeeName] = useState('')
    const [employeeId,setemployeeId] = useState('')
    const [availableFund,setavailableFund] = useState('')
    const [fundAmount,setfundAmount] = useState('')
    const [selectedEmployee, setselectedEmployee] = useState('')
    const [employeeList, setEmployeeList] = useState([])
    const [selctedEmployee,setSelctedEmployee] =useState('')
    const [NemployerAddress, setNemployerAddress] = useState('');
    const [NemployerSecret, setNemployerSecret] = useState('')
    const [salaryAmount,setSalaryAmount] = useState('')
    const [withdrawalNote,setWithdrawalNote] = useState('')
    const [employeeCommitment,setEmployeeCommitment] = useState('')

    useEffect(async () => {
        function handleNewAccounts(newAccounts) {
            setAccounts(newAccounts);
        }
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            await window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then(handleNewAccounts);
            await window.ethereum.on('accountsChanged', handleNewAccounts);
            return async () => {
                await window.ethereum.off('accountsChanged', handleNewAccounts);
            };
        }
    }, []);
   
    useEffect(() => {
        setemployerAddress(accounts)
        setNemployerAddress(accounts)
    }, [accounts])


useEffect(() => {
    async function getAvailableFund() {
        try {
            const result = await ZKPayroll.methods.getAvailableFund().call({from:accounts[0]})
            const _etherVal = web3.utils.fromWei(result, 'ether')
            if (_etherVal == 0){
                setavailableFund(0)
            }
            else {
                setavailableFund(_etherVal)
            }
            console.log('availableFund',_etherVal)
            
        } catch (err) {
            
            console.log(err)
        }
    }
    if (accounts.length > 0) {
        getAvailableFund()
    }
})
    

    async function generateCommitment() {

        const _message = web3.utils.soliditySha3(employerAddress.toString(),employerSecret.toString())

        const identity = new ZkIdentity(Strategy.MESSAGE, _message)
        const identityCommitment = identity.genIdentityCommitment()
        // // console.log(_message)
        // console.log(identity)
        // console.log(identityCommitment)

        return identityCommitment
    }

    async function NgenerateCommitment() {

        const _message = web3.utils.soliditySha3(NemployerAddress.toString(),NemployerSecret.toString())

        const identity = new ZkIdentity(Strategy.MESSAGE, _message)
        const identityCommitment = identity.genIdentityCommitment()
        // console.log(_message)
        // console.log(identity)
        // console.log(identityCommitment)

        return identityCommitment
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        setLoading(false)
        setErrorMessage('')
        try {
            const identityCommitment =await  generateCommitment()
            // console.log(identityCommitment)
            const result = await ZKPayroll.methods.addEmployerCommitment(identityCommitment).send({ from: accounts[0] })
            // console.log(result)
            setErrorMessage("Employer's commitment stored successfully.")
        } catch (err) {
            setErrorMessage(err.message)
            // console.log(err)
        }
        setLoading(true)

    }

    const onSubmitEmployee = async (event) => {
        event.preventDefault()
        setLoading(false)
        setErrorMessage('')
        try {
            const result = await ZKPayroll.methods.addEmployee(employeeName).send({ from: accounts[0] })
            // console.log(result)
            const _employeeId = result.events.employeeCreated.returnValues._employeeId
            // console.log(_employeeId)
            setemployeeId(_employeeId)
            setErrorMessage("Employee Added successfully.")
        } catch (err) {
            setErrorMessage(err.message)
            // console.log(err)
        }
        setLoading(true)
    }

    const onSubmitFund = async (event) => {
        event.preventDefault()
        setLoading(false)
        setErrorMessage('')
        try {
            const _weiValue = web3.utils.toWei(fundAmount,"ether")
            const result = await ZKPayroll.methods.addfundToContract().send({ from: accounts[0],value:_weiValue })
            // console.log(result)
            setErrorMessage("Fund Added successfully.")
            window.location.reload()
        } catch (err) {
            setErrorMessage(err.message)
            // console.log(err)
        }
        setLoading(true)
    }

    const onSubmitNote = async (event) => {
        event.preventDefault()
        setLoading(false)
        setErrorMessage('')
        try {
            const identityCommitment =await  NgenerateCommitment()
            // console.log('ReceviedCommitments',identityCommitment.toString())
            const _randomNum = Math.floor(Math.random() * 10000000000)
            // console.log('RandomNumber',_randomNum.toString())
            // console.log('EmployeeId',selectedEmployee)
            const _weisalary = web3.utils.toWei(salaryAmount,'ether')
            // console.log('Salary',_weisalary)
            const _notes = web3.utils.soliditySha3(identityCommitment.toString(),_randomNum.toString())
            // console.log(_notes)

            const _leaves = web3.utils.soliditySha3(_notes.toString(),employeeCommitment.toString())
            // console.log(_leaves)
            const identity = new ZkIdentity(Strategy.MESSAGE, _leaves)
            const leavesCommitment = identity.genIdentityCommitment()

            const result = await ZKPayroll.methods.addNotes(selctedEmployee,_weisalary,identityCommitment,leavesCommitment).send({ from: accounts[0] })
            // console.log(result)
            setWithdrawalNote(_notes)
            // setWithdrawalNote(result.noteCreated.returnValues._uintNotesCommitment);
            setErrorMessage("Notes generated successfully. Please copy notes and share with employee to withdraw salary.")
        } catch (err) {
            setErrorMessage(err.message)
            // console.log(err)
        }
        setLoading(true)
    }

    useEffect(() => {

        async function getEmployerEmployee() {
            // console.log(accounts[0])
            const result = await ZKPayroll.methods.getEmployeeIdList().call({from:accounts[0]})
            if (result.length > 0) {
                
                result.forEach(async i => {
                    const _result = await ZKPayroll.methods.getEmployeeDetails(i).call({from:accounts[0]})
                    // console.log(_result)
                    setEmployeeList(prevstate => [
                        ...prevstate,
                        {
                            employeeId: i,
                            employeeName: _result[0],
                            employeeState: _result[1],
                            employerId: _result[2],
                            employeeCommitment: _result[3]
                        }
                    ])
                })

            }

        }
        if (accounts.length > 0) {
            getEmployerEmployee()
        }

    }, [accounts])

    useEffect(() => {
        // console.log(employeeList)
    }, [employeeList])

    function Options(props) {
        return (
            <option value={props.value}>{props.name}</option>
        )
    }

    function SelectOption() {
        return (employeeList.map((i, index) => {
            return (
                <Options
                    key={index}
                    value={i.employeeId}
                    name={i.employeeId + '-' + i.employeeName}
                />
            )
        }))

    }

    const selectionOnChange = async (event) => {
        event.preventDefault()
        setselectedEmployee(event.target.value)
        if (event.target.value !== "Select Employee") {
            const id = event.target.value
            setSelctedEmployee(id)
            const _result = await ZKPayroll.methods.getEmployeeDetails(id).call({from:accounts[0]})
            setEmployeeCommitment(_result[3])
        } 

    }


    return (
        <Base>
           <div className="EmployerContainer">
                <h3 className="card-title m-2 text-center">Employer Portal</h3>
                <div className="container card shadow">
                    <div className="accordion accordion-flush mt-2" id="employerFlush">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="commitment-heading">
                                <button className="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#commitment-collapse" aria-expanded="false" aria-controls="commitment-collapse">
                                    Generate Employer Commitment
                                </button>
                            </h2>
                            <div id="commitment-collapse" className="accordion-collapse collapse" aria-labelledby="commitment-heading" data-bs-parent="#employerFlush">
                                <div className="accordion-body">
                                    <p>Please generate your secret commitmnet.
                                    </p>
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="nameInput" className="form-label">Employer Address</label>
                                            <input id="nameInput" aria-describedby="nameHelp" type='text'
                                                className="form-control"
                                                value={employerAddress}
                                                onChange={(event) => setemployerAddress(event.target.value)}
                                                required
                                                readOnly={true}
                                            />
                                            <div id="nameHelp" className="form-text">e.g."Employer address use for further process."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="secretInput" className="form-label">Employer Secret</label>
                                            <input id="secretInput" aria-describedby="secretHelp" type='text'
                                                className="form-control"
                                                value={employerSecret}
                                                onChange={(event) => setemployerSecret(event.target.value)}
                                                required
                                                readOnly={commitmentStatus}
                                            />
                                            <div id="secretHelp" className="form-text">e.g."Employer Secret which employer has to remenber."</div>
                                        </div>
                                        <span className="text-danger" hidden={!errorMessage}>{errorMessage}</span>
                                        <div className="mb-3 d-flex" style={{ alignItems: 'center' }}>
                                            <button type="submit" className="btn btn-dark form-control" disabled={(!loading) || (commitmentStatus)}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" hidden={loading}></span>
                                                Generate Commitment</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="create-heading">
                                <button className="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#create-collapse" aria-expanded="false" aria-controls="create-collapse">
                                    Add Employee
                                </button>
                            </h2>
                            <div id="create-collapse" className="accordion-collapse collapse" aria-labelledby="create-heading" data-bs-parent="#employerFlush">
                                <div className="accordion-body">
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmitEmployee}>
                                        <div className="row mb-3">
                                            <label htmlFor="employeeName" className="form-label col-lg-4"> Employee Name</label>
                                            <div className="col-lg-6">
                                                <input id="employeeName" aria-describedby="employeeNameHelp" type='text'
                                                    className="form-control"
                                                    value={employeeName}
                                                    onChange={(event) => setemployeeName(event.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="employeeId" className="form-label col-lg-4">Registed Employee Id</label>
                                            <div className="col-lg-6">
                                                <input id="employeeId" aria-describedby="employeeIdHelp" type='text'
                                                    className="form-control"
                                                    value={employeeId}
                                                    readOnly = {true}
                                                />
                                                <div id="employeeIdHelp" className="form-text">e.g."Uniq Employee Id return from contract."</div>
                                            </div>
                                        </div>
                                        <span className="text-danger" hidden={!errorMessage}>{errorMessage}</span>
                                        <div className="mb-3" >
                                            <button type="submit" className="btn btn-dark form-control" disabled={(!loading)}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" hidden={loading}></span>
                                                Add Employee</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="addFund">
                                <button className="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#fund-collapse" aria-expanded="false" aria-controls="create-collapse">
                                    Add Fund
                                </button>
                            </h2>
                            <div id="fund-collapse" className="accordion-collapse collapse" aria-labelledby="addFund" data-bs-parent="#employerFlush">
                                <div className="accordion-body">
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmitFund}>
                                        <div className="row mb-3">
                                            <label htmlFor="availableFund" className="form-label col-lg-4">Available Fund (in ONE) </label>
                                            <div className="col-lg-6">
                                                <input id="availableFund" aria-describedby="availableFundHelp" type='text'
                                                    className="form-control"
                                                    value={availableFund}
                                                    readOnly = {true}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="fund" className="form-label col-lg-4">Fund amount (in ONE)</label>
                                            <div className="col-lg-6">
                                                <input id="fund" aria-describedby="fundHelp" type='text'
                                                    className="form-control"
                                                    value={fundAmount}
                                                    onChange={(event) => setfundAmount(event.target.value)}
                                                    required
                                                />
                                                <div id="fundHelp" className="form-text">e.g."Please add fund require to process payroll"</div>
                                            </div>
                                        </div>
                                        <span className="text-danger" hidden={!errorMessage}>{errorMessage}</span>
                                        <div className="mb-3" >
                                            <button type="submit" className="btn btn-dark form-control" disabled={(!loading)}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" hidden={loading}></span>
                                                Add Fund</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="createNote">
                                <button className="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#createNote-collapse" aria-expanded="false" aria-controls="create-collapse">
                                    Create Notes
                                </button>
                            </h2>
                            <div id="createNote-collapse" className="accordion-collapse collapse" aria-labelledby="createNote" data-bs-parent="#employerFlush">
                                <div className="accordion-body">
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmitNote}>
                                    <div className="row mb-3">
                                        <div className="col-lg-4 mt-2">
                                            <label htmlFor="EmployeeDetails" className="form-label ">Select Employee</label>
                                        </div>

                                        <div className="col-auto mt-2">
                                            <select className="form-select"
                                                value={selectedEmployee}
                                                onChange={selectionOnChange}>
                                                <option value="Select Contract"> Select Employee </option>
                                                <SelectOption />
                                            </select>
                                        </div>
                                    </div>
                                        <div className="row mb-3">
                                            <label htmlFor="selectedemployeeId" className="form-label col-lg-4">Selected EmployeeId </label>
                                            <div className="col-lg-6">
                                                <input id="selectedemployeeId" aria-describedby="selectedemployeeIdHelp" type='text'
                                                    className="form-control"
                                                    value={selectedEmployee}
                                                    readOnly = {true}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="salary" className="form-label col-lg-4">Salary amount (in ONE)</label>
                                            <div className="col-lg-6">
                                                <input id="salary" aria-describedby="salaryHelp" type='text'
                                                    className="form-control"
                                                    value={salaryAmount}
                                                    onChange={(event) => setSalaryAmount(event.target.value)}
                                                    required
                                                />
                                                <div id="salaryHelp" className="form-text">e.g."Please enter salary amount."</div>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="NnameInput" className="form-label">Employer Address</label>
                                            <input id="NnameInput" aria-describedby="NnameHelp" type='text'
                                                className="form-control"
                                                value={NemployerAddress}
                                                onChange={(event) => setNemployerAddress(event.target.value)}
                                                required
                                                readOnly={true}
                                            />
                                            <div id="NnameHelp" className="form-text">e.g."Employer address use for further process."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="NsecretInput" className="form-label">Employer Secret</label>
                                            <input id="NsecretInput" aria-describedby="NsecretHelp" type='text'
                                                className="form-control"
                                                value={NemployerSecret}
                                                onChange={(event) => setNemployerSecret(event.target.value)}
                                                required
                                                readOnly={commitmentStatus}
                                            />
                                            <div id="NsecretHelp" className="form-text">e.g."Employer Secret which employer has to remenber."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="notesInput" className="form-label">Withdrawal Notes</label>
                                            <input id="notesInput" aria-describedby="notesHelp" type='text'
                                                className="form-control"
                                                value={withdrawalNote}
                                                readOnly={true}
                                            />
                                            <div id="notesHelp" className="form-text">e.g."Please copy notes and share with employee to withdraw salary."</div>
                                        </div>
                                        <span className="text-danger" hidden={!errorMessage}>{errorMessage}</span>
                                        <div className="mb-3" >
                                            <button type="submit" className="btn btn-dark form-control" disabled={(!loading)}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" hidden={loading}></span>
                                                Create Note</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Base>
    )
}

export default Admin