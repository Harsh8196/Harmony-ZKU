import React, { useState, useEffect } from 'react'
import Base from './Base'
import ZKPayroll from '../script/ZKPayroll'
import MetaMaskOnboarding from '@metamask/onboarding';
import '../css/Admin.css'



function Admin() {
   
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
        async function getEmployerList() {
            var issuerRequestArray = []
            // console.log(await OnescanVerify.methods.issuerRequestCount().call())
            const employerListarray = await ZKPayroll.methods.addressToemployer().call();
            console.log(employerListarray)
        }
        getarray()
    }, [])


    return (
        <Base>
            <h1> Test Admin</h1>
        </Base>
    )
}

export default Admin