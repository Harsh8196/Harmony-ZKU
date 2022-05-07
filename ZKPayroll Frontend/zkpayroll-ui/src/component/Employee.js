import React, { useState, useEffect } from 'react'
import Base from './Base'
import '../css/Employee.css'
import { utils } from "ethers"
import ZKPayroll from '../script/ZKPayroll'
import MetaMaskOnboarding from '@metamask/onboarding';
import web3 from "../script/web3_"
import { ZkIdentity, Strategy } from "@zk-kit/identity"
import { Semaphore} from "@zk-kit/protocols"
import { createMerkleProof } from "../script/utils"



function Employee() {

    const [accounts, setAccounts] = useState('');
    const [employeeAddress, setemployeeAddress] = useState('');
    const [errorMessage,setErrorMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [employeeSecret, setemployeeSecret] = useState('')
    const [commitmentStatus, setcommitmentStatus] = useState(false)
    
    const [employeeId,setemployeeId] = useState('')
    const [withdrawalNotes,setwithdrawalNotes] = useState('')
    const [payoutAddress,setpayoutAddress] = useState('')
    

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
        setemployeeAddress(accounts)
    }, [accounts])

    async function generateCommitment() {

        const _message = web3.utils.soliditySha3(employeeAddress.toString(),employeeSecret.toString(),employeeId.toString())

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
            const result = await ZKPayroll.methods.addEmployeeCommitment(identityCommitment,employeeId).send({ from: accounts[0] })
            // console.log(result)
            setErrorMessage("employee's commitment stored successfully.")
        } catch (err) {
            setErrorMessage(err.message)
            // console.log(err)
        }
        setLoading(true)

    }



    const onSubmitNotes = async (event) => {

        event.preventDefault()
        setLoading(false)
        setErrorMessage('')

    const identityCommitment =await  generateCommitment()

    const _leaves = web3.utils.soliditySha3(withdrawalNotes.toString(),identityCommitment.toString())

    const identity = new ZkIdentity(Strategy.MESSAGE, _leaves)
    const leavesCommitment = identity.genIdentityCommitment()

    const result = await ZKPayroll.methods.getEmployeeEmployerId(employeeId).call()
    // console.log(result)
    const employerId = result[0]
     
    const getLeaves = await ZKPayroll.methods.getEmployerLeaves(employerId).call()
    // console.log()
    const merkleProof = createMerkleProof(getLeaves, leavesCommitment)
    const withdraw = "1"
    const bytes32Withdraw = utils.formatBytes32String(withdraw)

    const witness = Semaphore.genWitness(identity.getTrapdoor(), identity.getNullifier(), merkleProof, employerId, withdraw)


    const { proof, publicSignals } = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey")
    const solidityProof = Semaphore.packToSolidityProof(proof)
        
        try {
            const result = await ZKPayroll.methods.withdrawNotes(leavesCommitment,payoutAddress,bytes32Withdraw,publicSignals.nullifierHash,employerId,solidityProof).send({ from: accounts[0] })
            // console.log(result)
            setErrorMessage("Note withdraw successfully.")
        } catch (err) {
            setErrorMessage(err.message)
            // console.log(err)
        }
        setLoading(true)
    }


    return (
        <Base>
           <div className="EmployeeContainer">
                <h3 className="card-title m-2 text-center">Employee Portal</h3>
                <div className="container card shadow">
                    <div className="accordion accordion-flush mt-2" id="employeeFlush">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="commitment-heading">
                                <button className="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#commitment-collapse" aria-expanded="false" aria-controls="commitment-collapse">
                                    Generate Employee Commitment
                                </button>
                            </h2>
                            <div id="commitment-collapse" className="accordion-collapse collapse" aria-labelledby="commitment-heading" data-bs-parent="#employeeFlush">
                                <div className="accordion-body">
                                    <p>Please generate your secret commitmnet.
                                    </p>
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="employeeIdInput" className="form-label">Employee Id</label>
                                            <input id="employeeIdInput" aria-describedby="employeeIdHelp" type='text'
                                                className="form-control"
                                                value={employeeId}
                                                onChange={(event) => setemployeeId(event.target.value)}
                                                required
                                                readOnly={commitmentStatus}
                                            />
                                            <div id="employeeIdHelp" className="form-text">e.g."Employee id  which is given by employer."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="nameInput" className="form-label">Employee Address</label>
                                            <input id="nameInput" aria-describedby="nameHelp" type='text'
                                                className="form-control"
                                                value={employeeAddress}
                                                onChange={(event) => setemployeeAddress(event.target.value)}
                                                required
                                                readOnly={true}
                                            />
                                            <div id="nameHelp" className="form-text">e.g."Employee address use for further process."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="secretInput" className="form-label">Employee Secret</label>
                                            <input id="secretInput" aria-describedby="secretHelp" type='text'
                                                className="form-control"
                                                value={employeeSecret}
                                                onChange={(event) => setemployeeSecret(event.target.value)}
                                                required
                                                readOnly={commitmentStatus}
                                            />
                                            <div id="secretHelp" className="form-text">e.g."employee Secret which employee has to remenber."</div>
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
                                    Withdraw Note
                                </button>
                            </h2>
                            <div id="create-collapse" className="accordion-collapse collapse" aria-labelledby="create-heading" data-bs-parent="#issuerFlush">
                                <div className="accordion-body">
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmitNotes}>
                                    <div className="mb-3">
                                            <label htmlFor="employeeIdInput" className="form-label">Employee Id</label>
                                            <input id="employeeIdInput" aria-describedby="employeeIdHelp" type='text'
                                                className="form-control"
                                                value={employeeId}
                                                onChange={(event) => setemployeeId(event.target.value)}
                                                required
                                                readOnly={commitmentStatus}
                                            />
                                            <div id="employeeIdHelp" className="form-text">e.g."Employee id  which is given by employer."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="nameInput" className="form-label">Employee Address</label>
                                            <input id="nameInput" aria-describedby="nameHelp" type='text'
                                                className="form-control"
                                                value={employeeAddress}
                                                onChange={(event) => setemployeeAddress(event.target.value)}
                                                required
                                                readOnly={true}
                                            />
                                            <div id="nameHelp" className="form-text">e.g."Employee address use for further process."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="secretInput" className="form-label">Employee Secret</label>
                                            <input id="secretInput" aria-describedby="secretHelp" type='text'
                                                className="form-control"
                                                value={employeeSecret}
                                                onChange={(event) => setemployeeSecret(event.target.value)}
                                                required
                                                readOnly={commitmentStatus}
                                            />
                                            <div id="secretHelp" className="form-text">e.g."employee Secret which employee has to remenber."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="notesInput" className="form-label">withdrawal Note</label>
                                            <input id="notesInput" aria-describedby="notesHelp" type='text'
                                                className="form-control"
                                                value={withdrawalNotes}
                                                onChange={(event) => setwithdrawalNotes(event.target.value)}
                                                required
                                                
                                            />
                                            <div id="secretHelp" className="form-text">e.g."employee's withdrawal Note."</div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="addressInput" className="form-label">Payout Address</label>
                                            <input id="addressInput" aria-describedby="addressHelp" type='text'
                                                className="form-control"
                                                value={payoutAddress}
                                                onChange={(event) => setpayoutAddress(event.target.value)}
                                                required
                                                
                                            />
                                            <div id="addressHelp" className="form-text">e.g."employee's Payout Address"</div>
                                        </div>
                                        <span className="text-danger" hidden={!errorMessage}>{errorMessage}</span>
                                        <div className="mb-3 d-flex" style={{ alignItems: 'center' }}>
                                            <button type="submit" className="btn btn-dark form-control" disabled={(!loading) || (commitmentStatus)}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" hidden={loading}></span>
                                                Withdraw Notes</button>
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

export default Employee