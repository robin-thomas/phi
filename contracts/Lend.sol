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

  mapping(string => Ledger) ledger;

  event CreateLoan(string loanId, uint amount, uint months, address from, address to);
  event ApproveLoan(string loanId);
  event ReceiveLoan(string loanId);
  event CloseLoan(string loanId);

  constructor() {}

  function createLoan(Ledger memory _loan) public {
    require(_loan.amount >= 1, 'Loan amount should be gte 1');
    require(_loan.to == msg.sender, 'Loan receiver should be msg sender');
    require(_loan.months > 0 && _loan.months <= 12, 'Loan tenure should be between 1-12 months');

    _loan.block = block.number;
    _loan.status = LendStatus.CREATE;
    ledger[_loan.loanId] = _loan;

    emit CreateLoan(_loan.loanId, _loan.amount, _loan.months, _loan.from, _loan.to);
  }

  function approvaLoan(string memory _loanId) public payable {
    Ledger memory _loan = ledger[_loanId];

    require(_loan.from == msg.sender, 'Loan can be approved only by lender');
    require(_loan.status == LendStatus.CREATE, 'Loan not in correct status');
    require(_loan.amount == msg.value, 'Loan amount should match msg value');

    _loan.status = LendStatus.SENDER_SENT;
    ledger[_loanId] = _loan;

    emit ApproveLoan(_loanId);
  }

  function getLoan(string memory _loanId) public view returns (Ledger memory _loan) {
    _loan = ledger[_loanId];
  }

  function receiveLoan(string memory _loanId) public {
    Ledger memory _loan = ledger[_loanId];

    require(_loan.status == LendStatus.SENDER_SENT, 'Loan not in sender sent status');
    require(_loan.to == msg.sender, 'Invalid loan lendee');

    _loan.status = LendStatus.RECEIVER_RECEIVED;
    ledger[_loanId] = _loan;
    emit ReceiveLoan(_loanId);

    // Transfer the eth to receiver.
    address payable _to = payable(_loan.to);
    (bool _sent, ) = _to.call{value: _loan.amount}("");
    require(_sent, 'Failed to send ether');
  }

  function closeLoan(string memory _loanId) public {
    Ledger memory _loan = ledger[_loanId];

    require(_loan.status == LendStatus.RECEIVER_RECEIVED, 'Loan not in receiver received status');
    require(_loan.from == msg.sender, 'Only lender can close the loan');

    _loan.status = LendStatus.CLOSED;
    ledger[_loanId] = _loan;

    emit CloseLoan(_loanId);
  }
}
