import { ethers } from 'ethers';

import contract from '../artifacts/contracts/Lend.sol/Lend.json';

class Contract {
  static getInstance() {
    return new Contract().build();
  }

  static getClassName() {
    return 'Contract';
  }

  build() {
    const url = `${process.env.ALCHEMY_URL}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    const provider = new ethers.providers.JsonRpcProvider(url);

    this.rcontract = new ethers.Contract(
      process.env.ETH_CONTRACT_ADDRESS,
      contract.abi,
      provider
    );

    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

    this.wcontract = new ethers.Contract(
      process.env.ETH_CONTRACT_ADDRESS,
      contract.abi,
      signer
    )

    return this;
  }

  async createLoan(loan) {
    loan.amount = ethers.utils.parseEther(loan.amount.toString());
    loan.months = ethers.BigNumber.from(loan.months);

    loan.block = ethers.BigNumber.from(0); // default vakue. will be overwritten in contract.
    loan.status = ethers.BigNumber.from(0); // default vakue. will be overwritten in contract.

    return await this.wcontract.createLoan(loan);
  }

  async getLoan(loanId) {
    const loan = await this.rcontract.getLoan(loanId);

    if (loan[0] === loan[1]) {
      return null;
    }

    return {
      from: loan[0],
      to: loan[1],
      amount: loan[2].toNumber(),
      block: loan[3].toNumber(),
      months: loan[4].toNumber(),
      status: loan[5],
      loanId: loan[6],
    };
  }

  async approvaLoan(loanId, lendee) {
    // TODO.
  }
}

export default Contract;
