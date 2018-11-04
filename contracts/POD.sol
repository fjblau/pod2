pragma solidity 0.4.24;

contract POD {
    // Model a POD

    string orderId;
    string lastStatus;
    address oCarrier;
    address owner;
    bool signed;
    uint256 createdTime;
    uint256 _statusTime;
    

    struct OrderStatus {
        uint orderStatusId;
        address statusBy;
        string status;
        uint256 statusTime;
    }
    
    uint public orderStatusCount = 0;
    
    OrderStatus[] public orderStatusList;
    
    event OrderAlreadySigned (string _orderId);

    constructor() public{
       owner = msg.sender;
       orderId = "test2";
       lastStatus = "Created";
       signed = false;
       createdTime = block.timestamp;
       
    }

    function getOrder() public constant returns (string _orderId, string _status, bool _signed) {
        return (orderId, lastStatus, signed);
    }

    function addCarrier (address _Carrier) public {
        oCarrier = _Carrier;
    }

    function addOrderStatus(string _status) public {
        if (signed == true) {
            emit OrderAlreadySigned("Order Already Signed");
        } else {
        if (keccak256(abi.encodePacked(_status)) == keccak256(abi.encodePacked("Signed"))) {
            signed = true;
        }
        orderStatusCount++;
        _statusTime = block.timestamp;
        OrderStatus memory orderStatus = OrderStatus(orderStatusCount, msg.sender, _status, _statusTime ); 
        orderStatusList.push(orderStatus);
        lastStatus = _status;
        }
    }

    function getStatusCount() public constant returns (uint statusCount) {
        return orderStatusList.length;
    }
}