# Blockchain Verified Sources - Varta.AI

## Overview

Varta.AI implements a blockchain-based verification system for news sources using smart contracts deployed on Polygon Mumbai Testnet. This ensures transparency, immutability, and decentralized trust scoring for news sources.

## Smart Contract: VerifiedSources

### Features
- **Decentralized Verification**: News sources verified through smart contracts
- **Trust Scoring**: Dynamic scoring system (1-100) based on reliability metrics
- **Category Classification**: Organized by source type (newspaper, broadcast, digital, agency)
- **Immutable Records**: Blockchain-stored verification data
- **Gas Optimization**: Efficient operations to minimize transaction costs

### Contract Address
```
Network: Polygon Mumbai Testnet
Chain ID: 80001
Contract: 0x742d35cc6570abb8a7c0c16e8c20c4b7e5c3c8f5 (example)
```

## Technical Implementation

### Frontend Integration
- **Web3.js & Ethers.js**: Dual blockchain library support
- **MetaMask Integration**: Seamless wallet connection
- **React Context**: Centralized blockchain state management
- **Real-time Verification**: Live source verification checks
- **Visual Indicators**: Trust score badges and verification status

### Smart Contract Functions
```solidity
// Add verified source (owner only)
function addVerifiedSource(
    string memory _domain,
    string memory _name,
    uint256 _trustScore,
    string memory _category
) external onlyOwner

// Check source verification
function isSourceVerified(string memory _domain) 
    external view returns (
        bool verified,
        uint256 trustScore,
        string memory name,
        string memory category
    )

// Get all verified sources
function getAllVerifiedSources() 
    external view returns (
        string[] memory domains,
        string[] memory names,
        uint256[] memory trustScores,
        string[] memory categories
    )
```

## Pre-Verified Sources

| Source | Domain | Trust Score | Category | Status |
|--------|---------|-------------|----------|---------|
| BBC News | bbc.com | 90/100 | Broadcast | ✅ Verified |
| Reuters | reuters.com | 95/100 | Agency | ✅ Verified |
| Associated Press | apnews.com | 95/100 | Agency | ✅ Verified |
| CNN | cnn.com | 85/100 | Broadcast | ✅ Verified |
| The New York Times | nytimes.com | 90/100 | Newspaper | ✅ Verified |
| The Guardian | theguardian.com | 88/100 | Newspaper | ✅ Verified |
| The Hindu | thehindu.com | 88/100 | Newspaper | ✅ Verified |
| TechCrunch | techcrunch.com | 85/100 | Digital | ✅ Verified |
| Bloomberg | bloomberg.com | 92/100 | Agency | ✅ Verified |
| Forbes | forbes.com | 85/100 | Newspaper | ✅ Verified |

## User Experience

### Verification Badges
- **Green Shield**: Verified source with trust score
- **Tooltip Details**: Source name, category, and blockchain confirmation
- **Color Coding**: 
  - Green (90-100): Highly Trusted
  - Blue (80-89): Trusted
  - Yellow (70-79): Moderately Trusted
  - Red (1-69): Low Trust

### Blockchain Management Page
- **Wallet Connection**: MetaMask integration with network switching
- **Source Management**: Add/remove verified sources (contract owner only)
- **Trust Score Updates**: Modify trust scores for existing sources
- **Real-time Data**: Live blockchain data synchronization

## Getting Started

### Prerequisites
1. **MetaMask Wallet**: Install and configure for Polygon Mumbai
2. **Test MATIC**: Get free tokens from [Polygon Faucet](https://faucet.polygon.technology/)
3. **Network Setup**: Add Polygon Mumbai testnet to MetaMask

### Configuration
```env
VITE_VERIFIED_SOURCES_CONTRACT_ADDRESS=0x742d35cc6570abb8a7c0c16e8c20c4b7e5c3c8f5
```

### Usage
1. Navigate to `/blockchain` in the application
2. Connect your MetaMask wallet
3. View verified sources and their trust scores
4. Contract owners can add/remove sources

## Security Features

- **Owner-Only Functions**: Critical operations restricted to contract owner
- **Input Validation**: Comprehensive parameter validation
- **Gas Optimization**: Minimal transaction costs
- **Event Logging**: All operations logged for transparency
- **Domain Validation**: Proper domain format verification

## Future Enhancements

- **Community Voting**: Decentralized trust score determination
- **Staking Mechanism**: Economic incentives for verification
- **Cross-Chain Support**: Multi-blockchain verification
- **API Integration**: Real-time fact-checking services
- **Governance Token**: Platform governance through tokenization

## Technical Stack

- **Blockchain**: Polygon Mumbai Testnet
- **Smart Contracts**: Solidity ^0.8.19
- **Frontend**: React + TypeScript
- **Web3 Libraries**: ethers.js, web3.js
- **State Management**: React Context API
- **UI Components**: Shadcn/ui + Radix UI

## Resources

- [Polygon Documentation](https://docs.polygon.technology/)
- [MetaMask Setup Guide](https://docs.polygon.technology/develop/metamask/)
- [Mumbai Testnet Explorer](https://mumbai.polygonscan.com/)
- [Polygon Faucet](https://faucet.polygon.technology/)
- [Smart Contract Code](./contracts/VerifiedSources.sol)

---

*This implementation demonstrates a complete blockchain integration for news source verification, providing transparency and trust in digital journalism.*