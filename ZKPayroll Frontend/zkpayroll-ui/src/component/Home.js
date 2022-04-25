import React, { useEffect } from 'react'
import Base from './Base'
import education from '../payroll.jpg'

import '../css/Home.css'


function Home() {


    return (
        <Base>
            <div className="HomeContainer">
                <div className="row mt-3 align-items-center">
                    <div className='col-6'>
                        <h1>ZKPayroll system for Web3 Community</h1>
                        <br />
                        <p>
                        ZK Payroll is a payroll platform for growing the web3.0 community.ZK Payroll is used to
protect the privacy of employees by using Zero Knowledge.
                        </p>
                    </div>
                    <div className='col-6'>
                        <img
                            src={education} />
                    </div>
                </div>
                <div className="row mt-3 align-items-center">
                    <h1>The Problem</h1>
                    <p>
                    In the traditional web3.0 payroll system , user information is publicly
                    available like how much wage an employee earns at a given point of time.
                    </p>
                </div>
                <div className="row mt-3 align-items-center">
                    <h1>The Solution</h1>
                    <div>
                        <p>
                        ZK Payroll is
                            used to protect employee privacy.The employees generate ‘commitment’ by providing secret
                            and employee code.This commitment stores on blockchain. HR will provide withdrawal
                            notes to employees and employees can withdraw their wage by providing commitment and
                            notes to their desired account. Employees claim their portion of the wage by providing a
                            ZK-proof that they belong in the merkle tree. This way ZK Payroll protects the privacy of
                            employees. So no one can know how much employees earn.

                        </p>
                        <br/>
                        <p className="fw bold">
                            Note: Currently this demo is only for POC. 
                            In future will incorporate new feature.
                        </p>
                    </div>
                </div>
                <div className="row mt-3 align-items-center">
                    <h1>Steps to use ZKPayroll</h1>
                    <div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">1. ZKPayroll admin register employer.</li>
                            <li className="list-group-item">2. Employer provide commitment and stored on blockchain.</li>
                            <li className="list-group-item">3. Employer add employee in ZKPayroll system.</li>
                            <li className="list-group-item">4. Employer add fund into ZKPayroll.</li>
                            <li className="list-group-item">5. Employee provide commitment and stored on blockchain.</li>
                            <li className="list-group-item">6. Employer generate notes and share with employee</li>
                            <li className="list-group-item">7. Employee withdraw notes to payout account.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </Base>
    )
}

export default Home