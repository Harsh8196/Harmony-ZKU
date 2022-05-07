import web3 from './web3_'
import ZKPayrollAbi from '../abi/ZKPayroll.json'


//const instance = new web3.eth.Contract(ZKPayrollAbi.abi,'0x4F61dDbd8073eb16c257A4329ECB1BDAF95585E0')  Testnet Contract
// console.log(instance)
const instance = new web3.eth.Contract(ZKPayrollAbi.abi,'0x9BBB0C1f4C088260B368277fBC161Aac93e1c21c')  //Mainnet Contract

export default instance

