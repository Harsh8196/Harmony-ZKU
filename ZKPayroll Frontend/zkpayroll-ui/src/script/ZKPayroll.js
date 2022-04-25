import web3 from './web3_'
import ZKPayrollAbi from '../abi/ZKPayroll.json'


const instance = new web3.eth.Contract(ZKPayrollAbi.abi,'0xc72A8CAaCfd8c71606A33a8086d3C20bA6d69F7e')  
// console.log(instance)

export default instance

