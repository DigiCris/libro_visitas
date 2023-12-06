// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract visita {

    struct Data {
        string mens;
        address eoa;
    }

    Data[] public mensajes;

    function getData() external view returns (Data[] memory){
        return mensajes;
    }

    function setData(string calldata _msg) external {
        mensajes.push(Data(_msg,msg.sender));
    }

}