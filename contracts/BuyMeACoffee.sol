//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// BuyMeACoffee deployed to:  0xA7FcDa4234FBDc25b64Be86C045Dcd83c7B6E5eb


contract BuyMeACoffee {
    // Event to emit when a memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos recieved from friends.
    Memo[] memos;

    // Address of contract deployer.
    address payable owner;

    // deployment logic.
    constructor() {
        owner = payable(msg.sender);
    }

    function buyCoffee(string memory _name, string memory _message) public payable{
        require(msg.value > 0, "Can't buy coffee with 0 eth");

        // Add the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a log event when a new memo is created.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
            );

    }

    // Send the entire balance stored in this contract to the owner.
    function withdrawTips() public {
        // anyone can call this function but the money will only be sent to the owner.
        require(owner.send(address(this).balance));
    }

    // Retrieve all the memos stored on the blockchain.
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
}
