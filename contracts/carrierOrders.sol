pragma solidity 0.4.24;

contract carrierOrders
{
    string carrierName;
    address carrierAddress;
    struct order {
        uint id;
        string orderNo;
        string status;
        uint256 statusDate;
    }

    uint public numOrders;
    mapping (uint => order) orders;

    constructor(string _CarrierName) public {
        carrierName = _CarrierName;
        carrierAddress = msg.sender;
        addOrderToCarrier("Order One", "Created", block.timestamp);
        addOrderToCarrier("Order Two", "Created", block.timestamp);
        addOrderToCarrier("Order Three", "Created", block.timestamp);
        addOrderToCarrier("Order Four", "Created", block.timestamp);
    }

    function returnCarrier() public view returns (string _Carrier, address _Address, uint _NumOrders) {
        return (carrierName, carrierAddress, numOrders);
    }

    function returnCarrierName() public view returns (string _Carrier){
        return (carrierName);
    }

    function returnCarrierAddress() public view returns (address _Carrier){
        return (carrierAddress);
    }

    function getNumOrders()  public view returns (uint _NumOrders){
        return (numOrders);
    }

    function addOrderToCarrier(string _OrderNo, string _Status, uint256 _StatusDate) public  {
        numOrders++;
        orders[numOrders] = order(numOrders, _OrderNo, _Status, _StatusDate);
    }

    function setOrderStatus(uint _OrderId, string _Status, uint256 _StatusDate) public  {
        orders[_OrderId].status = _Status;
        orders[_OrderId].statusDate = _StatusDate;
    }

    function getOrder(uint _OrderId) public view returns (uint _RetOrderId,string orderNo, string status, uint256 _statusDate) {
        return (_OrderId, orders[_OrderId].orderNo, orders[_OrderId].status, orders[_OrderId].statusDate);
    }
}