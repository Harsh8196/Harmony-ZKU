import React, { useState, useEffect } from 'react'
import Base from './Base'
import '../css/Admin.css'
import ZKPayroll from '../script/ZKPayroll'
import MetaMaskOnboarding from '@metamask/onboarding';

function Admin() {

    const [accounts, setAccounts] = useState('');
    const [employerAddress, setemployerAddress] = useState('');
    const [errorMessage,setErrorMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [registerStatus, setRegisterStatus] = useState(false)

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
        async function getarray() {
            
            const employerList = await ZKPayroll.methods.getEmployerList().call();
            // console.log(employerList)
        }
        getarray()
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault()
        setLoading(false)
        setErrorMessage('')
        try {

            const result = await ZKPayroll.methods.createEmployer(employerAddress).send({ from: accounts[0] })
            // console.log(result)
            setErrorMessage("Employer registed successfully.")
        } catch (err) {
            setErrorMessage(err.message)
            // console.log(err)
        }
        setLoading(true)

    }


    return (
        <Base>
           <div className="AdminContainer">
                <h3 className="card-title m-2 text-center">Admin Portal</h3>
                <div className="container card shadow">
                    <div className="accordion accordion-flush mt-2" id="issuerFlush">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="register-heading">
                                <button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#register-collapse" aria-expanded="true" aria-controls="register-collapse">
                                    Register Employer
                                </button>
                            </h2>
                            <div id="register-collapse" className="accordion-collapse collapse" aria-labelledby="register-heading" data-bs-parent="#issuerFlush">
                                <div className="accordion-body">
                                    <p>Fill the below form and register Employer.
                                    </p>
                                    <form className="m-2" style={{ height: '100%' }} onSubmit={onSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="nameInput" className="form-label">Employer Address</label>
                                            <input id="nameInput" aria-describedby="nameHelp" type='text'
                                                className="form-control"
                                                value={employerAddress}
                                                onChange={(event) => setemployerAddress(event.target.value)}
                                                required
                                                readOnly={registerStatus}
                                            />
                                            <div id="nameHelp" className="form-text">e.g."Employer address use for further process."</div>
                                        </div>
                                        <span className="text-danger" hidden={!errorMessage}>{errorMessage}</span>
                                        <div className="mb-3 d-flex" style={{ alignItems: 'center' }}>
                                            <button type="submit" className="btn btn-dark form-control" disabled={(!loading) || (registerStatus)}>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" hidden={loading}></span>
                                                Register</button>
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