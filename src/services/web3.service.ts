// import UserService from './user.service'
// import {tokenSwap} from '../utils';

import axios from "axios";

// class Web3Service {
//     user: UserService;
//     // web3: web3

//     constructor () {
//         this.user = new UserService();
//         // this.web3 = new web3()
//     }

//     swapToken = async(): boolean => {

//     }
// }

// export default Web3Service

axios.get(
  "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json"
).then(res=>console.log(res)).catch(err=>console.log(err));
