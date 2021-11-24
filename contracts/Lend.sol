// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Lend {
  enum LendStatus { CREATE, SENDER_SENT, RECEIVER_RECEIVED, CLOSED }

  struct Ledger {
    address from;
    address to;
    uint amount;
    uint block;
    uint months;
    LendStatus status;
    string loanId;
  }

  mapping(address => mapping(string => Ledger)) ledger;
  mapping(address => string[]) loanIds;

  constructor() {}

  function createLoan(Ledger memory _loan) public {
    require(_loan.amount > 0.01 ether, 'Loan amount should be greater than 0.01');
    require(_loan.to == msg.sender, 'Loan receiver should be msg sender');
    require(_loan.months > 0 && _loan.months <= 12, 'Loan tenure should be between 1-12 months');

    _loan.block = block.number;
    _loan.status = LendStatus.CREATE;
    ledger[_loan.to][_loan.loanId] = _loan;
    loanIds[_loan.to].push(_loan.loanId);
  }

  function approvaLoan(string memory _loanId, address lendee) public payable {
    Ledger memory _loan = ledger[lendee][_loanId];

    require(_loan.to == lendee, 'Invalid loan');
    require(_loan.from == msg.sender, 'Loan can be approved only by lender');
    require(_loan.status == LendStatus.CREATE, 'Loan not in correct status');
    require(_loan.amount == msg.value, 'Loan amount should match msg value');

    _loan.status = LendStatus.SENDER_SENT;
    ledger[lendee][_loanId] = _loan;
  }

  function getLoan(string memory _loanId) public view returns (Ledger memory _loan) {
    _loan = ledger[msg.sender][_loanId];
  }

  function receiveLoan(string memory _loanId) public {
    Ledger memory _loan = ledger[msg.sender][_loanId];

    require(_loan.status == LendStatus.SENDER_SENT, 'Loan not in sender sent status');

    _loan.status = LendStatus.RECEIVER_RECEIVED;
    ledger[msg.sender][_loanId] = _loan;

    // Transfer the eth to receiver.
    address payable _to = payable(_loan.to);
    (bool _sent, ) = _to.call{value: _loan.amount}("");
    require(_sent, 'Failed to send ether');
  }

  function closeLoan(string memory _loanId, address lendee) public {
    Ledger memory _loan = ledger[lendee][_loanId];

    require(_loan.status == LendStatus.RECEIVER_RECEIVED, 'Loan not in receiver received status');
    require(_loan.from == msg.sender, 'Only lender can close the loan');

    _loan.status = LendStatus.CLOSED;
    ledger[lendee][_loanId] = _loan;
  }
}
