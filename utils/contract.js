import { ethers, utils } from 'ethers';

import Utils from './index';
import Thread from './textile/thread';
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

    // create a contract object for pure, view functions.
    this.rcontract = new ethers.Contract(
      process.env.ETH_CONTRACT_ADDRESS,
      contract.abi,
      provider
    );

    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

    // create a contract object for transactions.
    this.wcontract = new ethers.Contract(
      process.env.ETH_CONTRACT_ADDRESS,
      contract.abi,
      signer
    )

    return this;
  }

  async createLoan(loan, threadID) {
    console.debug('Creating loan in smart contract', loan);

    // convert to big numbers.
    loan.amount = utils.parseEther(loan.amount.toString());
    loan.months = ethers.BigNumber.from(loan.months);

    // default values. will be overwritten in contract.
    loan.block = ethers.BigNumber.from(0);
    loan.status = ethers.BigNumber.from(0);

    // get the thread dbInfo object (which is required to join a thread).
    const thread = await Utils.getInstance(Thread);
    const metadata = await thread.getDBInfo(threadID);

    return await this.wcontract.createLoan(loan, metadata);
  }

  async getLoan(loanId) {
    const loan = await this.rcontract.getLoan(loanId);

    // loan doesnt exist in contract.
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
    // send the loan amount to approve the loan
    const overrides = {
      value: utils.parseEther(amount.toString()),
    }

    return await this.wcontract.approvaLoan(loanId, overrides);
  }

  async receiveLoan(loanId) {
    return await this.wcontract.receiveLoan(loanId);
  }

  async closeLoan(loanId, amount) {
    // send the loan amount to close the loan
    const overrides = {
      value: utils.parseEther(amount.toString()),
    }

    return await this.wcontract.closeLoan(loanId, overrides);
  }
}

Contract.STATUS_CREATING = 'CREATING';
Contract.STATUS_PENDING = 'PENDING';
Contract.STATUS_APPROVED = 'APPROVED';
Contract.STATUS_RECEIVED = 'RECEIVED';
Contract.STATUS_CLOSED = 'CLOSED';

Contract.getStatus = (status) => {
  switch (status) {
    case 0:
      return Contract.STATUS_PENDING;

    case 1:
      return Contract.STATUS_APPROVED;

    case 2:
      return Contract.STATUS_RECEIVED;

    case 3:
      return Contract.STATUS_CLOSED;

    default:
      return Contract.STATUS_CREATING;
  }
}

export default Contract;
