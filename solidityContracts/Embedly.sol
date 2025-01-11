// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Embedly {

    mapping(address => string[]) private userTemplates;

    event TemplateAdded(address indexed user, string templateId);

    event TemplateDeleted(address indexed user, string templateId);

   
    function addTemplate(string calldata templateId) external {
        userTemplates[msg.sender].push(templateId);
        emit TemplateAdded(msg.sender, templateId);
    }

    
    function deleteTemplate(string calldata templateId) external {
        string[] storage templates = userTemplates[msg.sender];
        bool found = false;

        for (uint256 i = 0; i < templates.length; i++) {
            if (keccak256(abi.encodePacked(templates[i])) == keccak256(abi.encodePacked(templateId))) {
                found = true;
                // Replace the element to delete with the last element
                templates[i] = templates[templates.length - 1];
                templates.pop(); // Remove the last element
                emit TemplateDeleted(msg.sender, templateId);
                break;
            }
        }

        require(found, "Template ID not found");
    }

    
    function getTemplates() external view returns (string[] memory) {
        return userTemplates[msg.sender];
    }

    function getTemplatesByAddress(address _user) external view returns (string[] memory) {
        return userTemplates[_user];
    }
}
