// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';

contract Lend is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  address private oracle;
  bytes32 private jobId;
  uint256 private fee;

  string private constant CREATE_LOAN_URL = 'https://connect-phi.vercel.app/api/loan/create';
  string private constant APPROVE_LOAN_URL = 'https://connect-phi.vercel.app/api/loan/approve';
  string private constant RECEIVE_LOAN_URL = 'https://connect-phi.vercel.app/api/loan/receive';
  string private constant CLOSE_LOAN_URL = 'https://connect-phi.vercel.app/api/loan/close';

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

  mapping(string => Ledger) private ledger;
  mapping(string => string) private metadata;
  mapping(bytes32 => string) private requests;

  constructor() {
    setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);

    oracle = 0x58BBDbfb6fca3129b91f0DBE372098123B38B5e9;
    jobId = "da20aae0e4c843f6949e5cb3f7cfe8c4";
    fee = 0.01 * 10 ** 18;
  }

  function createLoan(Ledger memory _loan, string memory _metadata) public {
    require(_loan.amount >= 1, 'Loan amount should be gte 1');
    require(_loan.to == msg.sender, 'Loan receiver should be msg sender');
    require(_loan.months > 0 && _loan.months <= 12, 'Loan tenure should be between 1-12 months');

    _loan.block = block.number;
    _loan.status = LendStatus.CREATE;
    ledger[_loan.loanId] = _loan;

    metadata[_loan.loanId] = _metadata;

    _helper(_loan.loanId, metadata[_loan.loanId], CREATE_LOAN_URL);
  }

  function approvaLoan(string memory _loanId) public payable {
    Ledger memory _loan = ledger[_loanId];

    require(_loan.from == msg.sender, 'Loan can be approved only by lender');
    require(_loan.status == LendStatus.CREATE, 'Loan not in correct status');
    require(_loan.amount == msg.value, 'Loan amount should match msg value');

    _helper(_loanId, metadata[_loanId], APPROVE_LOAN_URL);
  }

  function getLoan(string memory _loanId) public view returns (Ledger memory _loan) {
    _loan = ledger[_loanId];
  }

  function receiveLoan(string memory _loanId) public {
    Ledger memory _loan = ledger[_loanId];

    require(_loan.status == LendStatus.SENDER_SENT, 'Loan not in sender sent status');
    require(_loan.to == msg.sender, 'Invalid loan lendee');

    _helper(_loanId, metadata[_loanId], RECEIVE_LOAN_URL);

    // transfer to the lendee.
    address payable _to = payable(_loan.to);
    (bool _sent, ) = _to.call{value: _loan.amount}("");
    require(_sent, 'Failed to send the loan to lendee');
  }

  function closeLoan(string memory _loanId) public payable {
    Ledger memory _loan = ledger[_loanId];

    require(_loan.status == LendStatus.RECEIVER_RECEIVED, 'Loan not in receiver received status');
    require(_loan.to == msg.sender, 'Only lendee can close the loan');
    require(msg.value >= _loan.amount, 'Loan amount should match msg value');

    _helper(_loanId, metadata[_loanId], CLOSE_LOAN_URL);

    // transfer to the lender.
    address payable _to = payable(_loan.from);
    (bool _sent, ) = _to.call{value: _loan.amount}("");
    require(_sent, 'Failed to pay back the loan to lender');
  }

  //
  //////////////////////////////////////////////////////////////////////////////
  // HELPER FUNCTIONS
  //////////////////////////////////////////////////////////////////////////////
  //

  function _helper(string memory _loanId, string memory _thread, string memory _url) private {
    string memory _requestUrl = string(
      abi.encodePacked(_url, '?loanId=', _loanId, '&thread=', _thread)
    );

    Chainlink.Request memory _request = buildChainlinkRequest(
      jobId,
      address(this),
      this._callback.selector
    );
    _request.add('get', _requestUrl);
    _request.add('path', 'status');

    bytes32 _requestId = sendChainlinkRequestTo(oracle, _request, fee);
    requests[_requestId] = _loanId;
  }

  function _callback(bytes32 _requestId, LendStatus _status) public recordChainlinkFulfillment(_requestId) {
    string memory _loanId = requests[_requestId];
    Ledger memory _loan = ledger[_loanId];

    _loan.status = _status;
    ledger[_loanId] = _loan;
  }
}
