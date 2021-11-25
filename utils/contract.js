import { ethers, utils } from 'ethers';

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
    console.log('create loan', loan);

    loan.amount = utils.parseEther(loan.amount.toString());
    loan.months = ethers.BigNumber.from(loan.months);

    loan.block = ethers.BigNumber.from(0); // default vakue. will be overwritten in contract.
    loan.status = ethers.BigNumber.from(0); // default vakue. will be overwritten in contract.

    return await this.wcontract.createLoan(loan);
  }

  async getLoan(loanId) {
    const loan = await this.rcontract.getLoan(loanId);

    if (loan[0] === loan[1]) {
      return { status: Contract.STATUS_CREATING };
    }

    return {
      from: loan[0],
      to: loan[1],
      amount: parseInt(utils.formatEther(loan[2])),
      block: loan[3].toNumber(),
      months: loan[4].toNumber(),
      status: Contract.getStatus(loan[5]),
      loanId: loan[6],
    };
  }

  async approvaLoan(loanId, amount) {
    const overrides = {
      value: utils.parseEther(amount.toString()),
    }

    return await this.wcontract.approvaLoan(loanId, overrides);
  }

  async receiveLoan(loanId) {
    return await this.wcontract.receiveLoan(loanId);
  }
}

Contract.STATUS_CREATING = 'CREATING';
Contract.STATUS_PENDING = 'PENDING';
Contract.STATUS_APPROVED = 'APPROVED';
Contract.STATUS_RECEIVED = 'RECEIVED';

Contract.getStatus = (status) => {
  switch (status) {
    case 0:
      return Contract.STATUS_PENDING;

    case 1:
      return Contract.STATUS_APPROVED;

    case 2:
      return Contract.STATUS_RECEIVED;

    default:
      return Contract.STATUS_CREATING;
  }
}

export default Contract;
