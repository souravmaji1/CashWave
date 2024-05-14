import { Box, Flex, Heading, Text, Button, Icon, Input,Spinner } from '@chakra-ui/react';
import { IoHomeOutline, IoSettingsOutline, IoBarChartOutline } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import Image from 'next/image';
import Wizard from '../public/images/wizard.png';
import { useState,useEffect } from 'react';
import { ethers } from "ethers";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { Mailchain } from '@mailchain/sdk';
import Logo from '../public/images/logo.png';



export default function Home() {
  const [showBorrowSection, setShowBorrowSection] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [contractsection, setcontractSection] = useState(false);
  const [mainSection, setmainSection] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [status, setStatus] = useState('Not Connected');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [depositData, setDepositdata] = useState("");
  const [ swapsection, setShowSwapSection] = useState("");

  const [swapamount, setSwapAmount] = useState(0);

  const [conversionRate, setConversionRate] = useState(0.00000001);

  const usdcAmount = swapamount * conversionRate;
  
  const [duration, setDuration] = useState(60); // Default duration is 10 minutes (600 seconds)
  const [selecttoken, setSelectToken] = useState("");
  const [userdata, setUserdata] = useState("");
  const [nftcontract, setNftContract] = useState("");
  const [tokenid, setTokenId] = useState("");
  const [amount, setAmount] = useState('');
//const filteredEventDetail = data.find(eventDetail => eventDetail.tokenId.toString() === tokenId);
const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } catch (error) {
      console.error(error);
    }
  } else {
    alert('Please install MetaMask!');
  }
};



const disconnectWallet = () => {
  setAccount('');
  setStatus('Not Connected');
};

const handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
    disconnectWallet();
  } else {
    setAccount(accounts[0]);
    setStatus('Connected');
  }
};

const handleClick = () => {
    setmainSection(false);
    setcontractSection(true);
};

const handleBack = () => {
  setmainSection(true);
  setcontractSection(false);
};


const handleTabClick = (tab) => {
  setActiveTab(tab);
  if (tab === 'Home') {
    setShowBorrowSection(false);
    setcontractSection(false);
    setShowSwapSection(false);
  }
  if (tab === 'Lends') {
    setShowBorrowSection(true);
    setcontractSection(false);
    setShowSwapSection(false);
  }
  if (tab === 'Swap') {
    setShowBorrowSection(false);
    setcontractSection(false);
    setShowSwapSection(true);
  }
};

const secretRecoveryPhrase = "milk harsh kidney demise lonely swap sing mention decorate quick various begin abandon nature vanish attack salmon mouse anxiety forget surface rack sleep captain";

const mailchain = Mailchain.fromSecretRecoveryPhrase(secretRecoveryPhrase);

const EmailSend = async (borrowerAddress) => {
  const { data, error } = await mailchain.sendMail({
    from: `0x32e23c6ee71d759f65e531af513d6c938c15c1e4@ethereum.mailchain.com`, // sender address
    to:  [`${borrowerAddress}@ethereum.mailchain.com`], // list of recipients (blockchain or mailchain addresses)
    subject: 'USDC Not Paid! Remainder', // subject line
    content: {
        text: 'Hello Dear User 👋 Please Pay Back Your Borrowed USDC', // plain text body
        html: '<p>Hello Dear User 👋 Please Pay Back Your Borrowed USDC</p>', // html body
    },
  });
  console.log(data);
  if (error) {
    // handle error
    console.warn('Mailchain error', error);
    return;
  }  
}





useEffect(() => {

const FetchBorrowedUSDC = async () => {
  try {

    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.JsonRpcProvider("https://lisk-sepolia.drpc.org/");



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "type": "function",
        "name": "getBorrowerLoans",
        "inputs": [
        {
          "type": "address",
          "name": "borrower",
          "internalType": "address"
        }
        ],
        "outputs": [
        {
          "type": "tuple[]",
          "name": "",
          "components": [
          {
            "type": "uint256",
            "name": "tokenId",
            "internalType": "uint256"
          },
          {
            "type": "tuple",
            "name": "loan",
            "components": [
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "repaid",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "borrowedAt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            }
            ],
            "internalType": "struct NFTLoanContract.Loan"
          }
          ],
          "internalType": "struct NFTLoanContract.LoanWithTokenId[]"
        }
        ],
        "stateMutability": "view"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, provider);

    console.log(account);

    const borrow = await contract.getBorrowerLoans(account);
    const borrowerLoans = borrow.map((loanData) => ({
      tokenId: loanData[0].toString(), // Convert BigNumber to string
      loan: {
        borrower: loanData[1][0],
        amount: ethers.utils.formatEther(loanData[1][1]), // Convert Wei to USDC
        interestRate: ethers.utils.formatEther(loanData[1][2]), // Convert Wei to USDC
        repaid: loanData[1][3],
        duration: loanData[1][4].toString(), // Convert BigNumber to string
        borrowedAt: new Date(loanData[1][5] * 1000).toLocaleString(), // Convert Unix timestamp to a readable date string
        endTime: new Date(loanData[1][6] * 1000).toLocaleString() // Convert Unix timestamp to a readable date string
      }
    }));

    setUserdata(borrowerLoans);

    if (account) {
   // all the lines are working
   const currentTime = new Date().getTime() / 1000; // Get the current time in seconds
 
   const unpaidLoans = borrowerLoans.filter((loan) => {
     const endTimeDate = new Date(loan.loan.endTime);
     return !loan.loan.repaid && endTimeDate.getTime() < currentTime * 1000;
   });

   // Send email reminders for unpaid loans
   unpaidLoans.forEach((loan) => {
     const borrowerAddress = loan.loan.borrower;
     EmailSend(borrowerAddress); // Call the EmailSend function with the borrower's address
     console.log(`Email reminder sent for token ID ${loan.tokenId} to ${borrowerAddress}`);
   });

    }
  
  
    console.log(borrowerLoans);
  } catch (error) {
    console.error(error);
  }
};

FetchBorrowedUSDC();
//fetchDeposit();
fetchUserDeposit();

  }, [account]);

  

  const fetchUserDeposit = async () => {
    try {
     // Deploy the compiled contract using MetaMask
     const provider = new ethers.providers.JsonRpcProvider("https://lisk-sepolia.drpc.org/");
  
      const nftabi = [
        {
          "type": "function",
          "name": "getUserDepositDetails",
          "inputs": [
          {
            "type": "address",
            "name": "user",
            "internalType": "address"
          }
          ],
          "outputs": [
          {
            "type": "tuple[]",
            "name": "",
            "components": [
            {
              "type": "uint256",
              "name": "depositAmount",
              "internalType": "uint256"
            },
            {
              "type": "uint256",
              "name": "depositTimestamp",
              "internalType": "uint256"
            },
            {
              "type": "uint256",
              "name": "accumulatedRewards",
              "internalType": "uint256"
            }
            ],
            "internalType": "struct NFTLoanContract.DepositHistory[]"
          }
          ],
          "stateMutability": "view"
        }
      ];
      
      const usdccontract = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
  
      // Contract instance for the ERC20 or ERC721 token
      const tokenContract = new ethers.Contract(usdccontract, nftabi, provider);
  
      const approveTx = await tokenContract.getUserDepositDetails(account);
      setDepositdata(approveTx);
      
      console.log("user usdc deposited data:", approveTx);
  
      console.log("data fetched successful!");
    } catch (error) {
      console.error("Error approving token:", error);
    }
  };


  const approveUSDC = async () => {
    try {
      // Provider setup
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      const nftabi = [
        {
          "type": "function",
          "name": "approve",
          "inputs": [
          {
            "type": "address",
            "name": "spender",
            "internalType": "address"
          },
          {
            "type": "uint256",
            "name": "amount",
            "internalType": "uint256"
          }
          ],
          "outputs": [
          {
            "type": "bool",
            "name": "",
            "internalType": "bool"
          }
          ],
          "stateMutability": "nonpayable"
        }
      ];
      
      const usdccontract = "0x34b422de20051bDf8fcA23664C8265e70c0FCb21";
  
      // Contract instance for the ERC20 or ERC721 token
      const tokenContract = new ethers.Contract(usdccontract, nftabi, signer);
  
      const loanContractAddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";

      const weiAmount = ethers.utils.parseEther(amount.toString());

      console.log(weiAmount)
  
      // Call the approve function on the token contract
      const approveTx = await tokenContract.approve(loanContractAddress, weiAmount);
      
      console.log("Approval transaction:", approveTx);
  
      // Wait for transaction confirmation
      await approveTx.wait();
  
      console.log("Token approval successful!");
    } catch (error) {
      console.error("Error approving token:", error);
    }
  };
  



const approveToken = async () => {
  try {
    // Provider setup
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const nftabi = [
      {
        "type": "function",
        "name": "approve",
        "inputs": [
        {
          "type": "address",
          "name": "to",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ];

    // Contract instance for the ERC20 or ERC721 token
    const tokenContract = new ethers.Contract(nftcontract, nftabi, signer);

    const loanContractAddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";

    // Call the approve function on the token contract
    const approveTx = await tokenContract.approve(loanContractAddress, tokenid);
    
    console.log("Approval transaction:", approveTx);

    // Wait for transaction confirmation
    await approveTx.wait();

    console.log("Token approval successful!");
  } catch (error) {
    console.error("Error approving token:", error);
  }
};


const StakeNFT = async () => {
  try {
    setLoading(true);
  
    await approveToken();
    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "nftContract",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "stakeNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, signer);

    // Deploy the contract
    const call = await contract.stakeNFT(nftcontract, tokenid);

    console.log(call);

  
  } catch (error) {
    console.error(error);
  }
};


const claimUSDC = async () => {
  try {
    setLoading(true);

    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "type": "function",
        "name": "claimRewards",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, signer);

    // Deploy the contract
    const call = await contract.claimRewards();

    console.log(call);

  
  } catch (error) {
    console.error(error);
  }
};

const withdrawUSDC = async () => {
  try {
    setLoading(true);
  
   
    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "type": "function",
        "name": "withdrawDeposit",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, signer);

    // Deploy the contract
    const call = await contract.withdrawDeposit();

    console.log(call);

  
  } catch (error) {
    console.error(error);
  }
};

const swapRSC = async () => {
  try {
    setLoading(true);
  
   
    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "type": "function",
        "name": "swapRSCForUSDC",
        "inputs": [
        {
          "type": "uint256",
          "name": "rscAmount",
          "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, signer);

    // Deploy the contract
    const totalamount = ethers.utils.parseUnits(swapamount.toString(), 18);

    console.log(totalamount);

    const call = await contract.swapRSCForUSDC(totalamount);

    console.log(call);

  
  } catch (error) {
    console.error(error);
  }
};


const LendUSDC = async () => {
  try {
    setLoading(true);

    await approveUSDC();
  
   
    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "type": "function",
        "name": "depositUSDC",
        "inputs": [
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, signer);

    // Deploy the contract
    const totalamount = ethers.utils.parseUnits(swapamount.toString(), 18);


    const call = await contract.depositUSDC(totalamount);

    console.log(call);

  
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


const Borrow = async () => {
  try {
    setLoading(true);
  
    await new Promise((resolve, reject) => {
      StakeNFT()
        .then(resolve)
        .catch(reject);
    });
    
    // Delay for a short period (e.g., 5 seconds) to allow the blockchain to update the loans mapping
    await new Promise(resolve => setTimeout(resolve, 5000));
    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "type": "function",
        "name": "borrowUSDC",
        "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "duration",
          "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, signer);

    const weiAmount = ethers.utils.parseEther(amount.toString());

    const borrow = await contract.borrowUSDC(tokenid,weiAmount,duration);
    

    console.log(borrow);
    setLoading(false);
  } catch (error) {
    console.error(error);
  }
};

const Repayloan = async (tokenid,amount) => {
  try {
    setLoading(true);
  
   
    // Deploy the compiled contract using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();



    const contractaddress = "0x6B596C803e4bCf7F48BB18DbE5b6b49639bCeA49";
    const abi = [
      {
        "type": "function",
        "name": "repayLoan",
        "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256"
        }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ];

    // Create a contract factory using the ABI and bytecode
    const contract = new ethers.Contract(contractaddress, abi, signer);

    const call = await contract.repayLoan(tokenid,amount);

    console.log(call);


    setLoading(false);
  } catch (error) {
    console.error(error);
  }
};

const handleRepayLoan = async (tokenId, amount) => {
  await approveUSDC();
  Repayloan(tokenId, amount);
  console.log(amount)
};


  return (
    <Box bg="rgba(14,14,14,1)" color="white" minH="100vh" p={6}>
      <Flex bg="#22252abf" padding="17px" borderRadius="25px" justify="space-between" align="center">
        <Box sx={{display:"flex",alignItems:'center'}}>
        <Image src={Logo} alt="" style={{width:"52px",display:'flex'}} />
        <Heading>
          CashWave
          </Heading>
        </Box>
        {status !== 'Connected' && (
        <Button colorScheme="blue" onClick={connectWallet} >Connect</Button>
        )}
        {status === 'Connected' && (
          <Button colorScheme="blue" onClick={disconnectWallet} >Disconnect</Button>
        )}
      </Flex>

    

      {mainSection && (
        <>
        {showBorrowSection ? (
         <Flex mt={6} direction="row">
         <Box borderRadius="20px" p={2}  width="15%" mr={4}>
           <Flex sx={{paddingLeft:'20px'}} fontSize="19px" align="center" mb={4} onClick={() => handleTabClick('Home')} style={{ borderLeft: activeTab === 'Home' ? '2px solid white' : 'none', cursor: 'pointer' }}>
             <Icon as={IoHomeOutline} mr={2} />
             <Text>Home</Text>
           </Flex>
           <Flex sx={{paddingLeft:'20px'}} fontSize="20px" align="center" mb={4} onClick={() => handleTabClick('Lends')} style={{ borderLeft: activeTab === 'Lends' ? '2px solid white' : 'none', cursor: 'pointer' }}>
             <Icon as={IoSettingsOutline} mr={2} />
             <Text>Lends</Text>
           </Flex>
           <Flex sx={{paddingLeft:'20px'}} fontSize="19px" align="center" mb={4} onClick={() => handleTabClick('Swap')} style={{ borderLeft: activeTab === 'Swap' ? '2px solid white' : 'none', cursor: 'pointer' }}   >
             <Icon as={IoBarChartOutline} mr={2} />
             <Text>Swap</Text>
           </Flex>

           <Box sx={{marginTop:'244px'}}>
           <Flex sx={{paddingLeft:'20px'}} fontSize="20px" align="center" mb={4} onClick={() => handleTabClick('Lends')} >
             <Icon as={IoSettingsOutline} mr={2} />
             <Text>Lends</Text>
           </Flex>
           <Flex fontSize="19px" align="center" mb={4}>
             <Text fontSize={13} color="gray">Version: 7csdsds34</Text>
           </Flex>
           </Box>
         </Box>
          <Flex borderRadius="50px" flex="1" direction="column" align="center">
          
            <Flex  width="100%" justifyContent="space-between" alignItems="center" mt={4} mb={6}>
            <Heading display="flex" color="white" fontSize="25px">Your Lends
            {account && (
              <Text borderRadius="50px" bg="gray.800" fontSize="14px" padding="8px" color="white" ml={2}>{account.slice(0, 6)}...{account.slice(-4)}</Text>
            )}
            </Heading>
            
            <Box sx={{background:"rgba(22,24,28,1)",padding:'10px',borderRadius:'10px',display:"flex",alignItems:"baseline",gap:'10px'}} >
            <Button sx={{background:"rgba(59,62,70,1)",color:"white"}} onClick={() => setShowBorrowSection(true)}>
           
           <Text>Testnets</Text>
         </Button>
         <Text color="gray">Mainnets</Text>
            </Box>
             
            </Flex>







            <Tabs variant='unstyled' width="-webkit-fill-available">
  <TabList  sx={{background:"rgba(22,24,28,1)",padding:'10px',borderRadius:'10px',width:'26%'}} >
    <Tab _selected={{ color: 'white', bg: 'rgba(59,62,70,1)',borderRadius:'10px' }}>For Borrower</Tab>
    <Tab _selected={{ color: 'white', bg: 'rgba(59,62,70,1)',borderRadius:'10px' }}>For Lender</Tab>
  </TabList>
  <TabPanels pt='40px'>
    <TabPanel padding='0'>
       
    <TableContainer sx={{ background: "rgba(20,22,25,1)", border: "1px solid #3e424ab3", width: '100%', borderRadius: '10px' }}>
  <Table variant='unstyled'>
    <Thead borderBottom="1px solid #3e424ab3">
      <Tr>
        <Th>Token ID</Th>
        <Th>Amount</Th>
        <Th>Interest Rate</Th>
        <Th>Repaid</Th>
        
        <Th>End Time</Th>
        <Th>Pay</Th>
      </Tr>
    </Thead>
    <Tbody variant='unstyled'>
      {userdata.length > 0 ? (
        userdata.map((loan, index) => (
          <Tr key={index}>
            <Td>{loan.tokenId}</Td>
            <Td>{loan.loan.amount} USDC</Td>
            <Td>{loan.loan.interestRate} %</Td>
            <Td>{loan.loan.repaid ? 'Yes' : 'No'}</Td>
           
            <Td>{loan.loan.endTime}</Td>
            <Td>
              <Button
                colorScheme="blue"
                onClick={() => handleRepayLoan(loan.tokenId, ethers.utils.parseEther(loan.loan.amount).toString())}
                disabled={loan.loan.repaid === 'Yes'}
              >
                Repay Loan
              </Button>
            </Td>
          </Tr>
        ))
      ) : (
        <Tr>
          <Td colSpan={8} textAlign="center">
            No data available
          </Td>
        </Tr>
      )}
    </Tbody>
  </Table>
</TableContainer>
           
    </TabPanel>
    <TabPanel padding='0'>
     
<TableContainer sx={{ background: "rgba(20,22,25,1)", border: "1px solid #3e424ab3", width: '100%', borderRadius: '10px' }}>
  <Table variant='unstyled'>
    <Thead borderBottom="1px solid #3e424ab3">
      <Tr>
        <Th>Deposit Amount</Th>
        <Th>Deposit Timestamp</Th>
        <Th>Accumulated Rewards</Th>
        <Th>Claim Rewards</Th>
        <Th>Withdraw USDC</Th>
      </Tr>
    </Thead>
    <Tbody variant='unstyled'>
      {depositData && depositData.length > 0 ? (
        depositData.map((deposit, index) => (
          <Tr key={index}>
            <Td>{ethers.utils.formatEther(deposit.depositAmount)} USDC</Td>
            <Td>{new Date(deposit.depositTimestamp * 1000).toLocaleString()}</Td>
            <Td>{ethers.utils.formatEther(deposit.accumulatedRewards)} RSC</Td>
            <Td>
          <Button colorScheme="blue" onClick={() => claimUSDC()}>
            Claim Tokens
          </Button>
        </Td>
        <Td>
          <Button colorScheme="blue" onClick={() => withdrawUSDC()}>
            Withdraw USDC
          </Button>
        </Td>
          </Tr>
        ))
      ) : (
        <Tr>
          <Td colSpan={3} textAlign="center">
            No data available
          </Td>
        </Tr>
      )}
    </Tbody>
  </Table>
</TableContainer>


    </TabPanel>
  </TabPanels>
</Tabs>






         
            </Flex>
          </Flex>

) : swapsection ? (
  // Render the swap section
  <>
   <Flex mt={6} direction="row">
          <Box borderRadius="20px" p={2}  width="15%" mr={4}>
            <Flex sx={{paddingLeft:'20px'}} fontSize="19px" align="center" mb={4} onClick={() => handleTabClick('Home')} style={{ borderLeft: activeTab === 'Home' ? '2px solid white' : 'none', cursor: 'pointer' }}>
              <Icon as={IoHomeOutline} mr={2} />
              <Text>Home</Text>
            </Flex>
            <Flex sx={{paddingLeft:'20px'}} fontSize="20px" align="center" mb={4} onClick={() => handleTabClick('Lends')} style={{ borderLeft: activeTab === 'Lends' ? '2px solid white' : 'none', cursor: 'pointer' }} >
              <Icon as={IoSettingsOutline} mr={2} />
              <Text>Lends</Text>
            </Flex>
            <Flex sx={{paddingLeft:'20px'}} fontSize="19px" align="center" mb={4} onClick={() => handleTabClick('Swap')} style={{ borderLeft: activeTab === 'Swap' ? '2px solid white' : 'none', cursor: 'pointer' }}  >
              <Icon as={IoBarChartOutline} mr={2} />
              <Text>Swap</Text>
            </Flex>
            <Box sx={{marginTop:'244px'}}>
           <Flex sx={{paddingLeft:'20px'}} fontSize="20px" align="center" mb={4} onClick={() => handleTabClick('Lends')} >
             <Icon as={IoSettingsOutline} mr={2} />
             <Text>Lends</Text>
           </Flex>
           <Flex fontSize="19px" align="center" mb={4}>
             <Text fontSize={13} color="gray">Version: 7csdsds34</Text>
           </Flex>
           </Box>
          </Box>
          <Flex borderRadius="50px" flex="1" direction="column" align="center">
            
           

           
            <Box bg="#22252abf" borderRadius="20px" p={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontWeight="bold" color=''>Deposit</Text>
        <Text>Withdraw</Text>
      </Flex>
      <Flex justify="space-between" mb={4}>
        <Text>From</Text>
        <Flex>
          <Text mr={2}>RSC</Text>
          <Text>Token</Text>
        </Flex>
      </Flex>
      <Flex justify="space-between" mb={4}>
        <Input bg="rgba(34,36,41,1)"
          border="1px solid #3e424ab3"   
          width="28%"
          value={swapamount}
          onChange={(e) => setSwapAmount(e.target.value)}
        />
        <Text>Max 0.01871031</Text>
      </Flex>
     
      <Flex borderTop="1px solid #3e424ab3" pt={4}   justify="space-between" mb={4}>
        <Text>To</Text>
        <Text>USDC Token</Text>
      </Flex>
      <Flex justify="space-between" mb={4}>
        <Text>Receive</Text>
        <Text>{(swapamount * conversionRate).toFixed(18)}</Text>
      </Flex>
      <Flex justify="space-between" mb={4}>
        <Text>Transfer time</Text>
        <Text>~3 minutes</Text>
      </Flex>
      <Flex justify="space-between" mb={4}>
        <Text>Estimated fees</Text>
        <Text>0 ETH</Text>
      </Flex>
      <Button colorScheme="blue" w="full" onClick={swapRSC}>
        Bridge funds
      </Button>
    </Box>



          </Flex>
          </Flex>
  </>
        
        ) : (
          <Flex mt={6} direction="row">
          <Box borderRadius="20px" p={2}  width="15%" mr={4}>
            <Flex sx={{paddingLeft:'20px'}} fontSize="19px" align="center" mb={4} onClick={() => handleTabClick('Home')} style={{ borderLeft: activeTab === 'Home' ? '2px solid white' : 'none', cursor: 'pointer' }}>
              <Icon as={IoHomeOutline} mr={2} />
              <Text>Home</Text>
            </Flex>
            <Flex sx={{paddingLeft:'20px'}} fontSize="20px" align="center" mb={4} onClick={() => handleTabClick('Lends')} style={{ borderLeft: activeTab === 'Lends' ? '2px solid white' : 'none', cursor: 'pointer' }} >
              <Icon as={IoSettingsOutline} mr={2} />
              <Text>Lends</Text>
            </Flex>
            <Flex sx={{paddingLeft:'20px'}} fontSize="19px" align="center" mb={4} onClick={() => handleTabClick('Swap')} style={{ borderLeft: activeTab === 'Swap' ? '2px solid white' : 'none', cursor: 'pointer' }}  >
              <Icon as={IoBarChartOutline} mr={2} />
              <Text>Swap</Text>
            </Flex>
            <Box sx={{marginTop:'244px'}}>
           <Flex sx={{paddingLeft:'20px'}} fontSize="20px" align="center" mb={4} onClick={() => handleTabClick('Lends')} >
             <Icon as={IoSettingsOutline} mr={2} />
             <Text>Lends</Text>
           </Flex>
           <Flex fontSize="19px" align="center" mb={4}>
             <Text fontSize={13} color="gray">Version: 7csdsds34</Text>
           </Flex>
           </Box>
          </Box>
          <Flex borderRadius="50px" flex="1" direction="column" align="center">
            <Heading width="100%">Borrow USDC Today!</Heading>
            <Flex width="100%" justifyContent="space-between" alignItems="center" mt={4} mb={6}>
              <Text>
                Server-less event-driven functions to automate blockchain transactions
              </Text>
              <Button colorScheme="blue" onClick={() => handleClick()}>
                <Icon as={LuPlus} mr={2} />
                <Text>Borrow USDC</Text>
              </Button>
            </Flex>
            <Flex
            className='home'
              borderRadius="30px"
              direction="row"
              align="center"
              p={6}
              width="100%"
              justify="space-between"
            >
              <Flex direction="column" align="flex-start">
              </Flex>
              <Box ml={6}>
                <Image src={Logo} style={{ height: '50vh', width: '100%' ,borderRadius:'20px'}} alt="Web3 Functions" />
              </Box>
            </Flex>
          </Flex>
          </Flex>
        )}
        </>
      )}

     

      {contractsection && ( 
        <>
<Box>


        <Box display="flex" margin="auto" width="61%" justifyContent="flex-start" bg="rgba(14,14,14,1)" color="white"  mt={8} >
          {/* Add content for the Borrow section here */}
          <Button onClick={() => handleBack()}>Go Back</Button>
        </Box>

        <Box display="flex" margin="auto" width="max-content"  justifyContent="flex-start" bg="rgba(14,14,14,1)" color="white" p={3} mt={8}>
          <Text mb={4}>CashWave - Borrow or Lend USDC</Text>
          </Box>

          <Tabs variant='unstyled'>
  <TabList display="flex" margin="auto" width="max-content"  justifyContent="center"  sx={{background:"rgba(22,24,28,1)",padding:'10px',borderRadius:'10px',width:'20%'}}  >
    <Tab _selected={{ color: 'white', bg: 'rgba(59,62,70,1)',borderRadius:'10px',width:'50%' }}>Borrow</Tab>
    <Tab _selected={{ color: 'white', bg: 'rgba(59,62,70,1)',borderRadius:'10px',width:'50%' }}>Lend</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <Box display="flex" flexWrap="wrap"  margin="auto" width="61%" borderRadius="20px"   justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" p={6} mt={2}>
          <Box borderBottom="1px solid #3e424ab3" width="100%">
          <Text mb={4}>Enter your contract address</Text>
          <Input
          mb={6}
          bg="rgba(34,36,41,1)"
          border="1px solid #3e424ab3"
          value={nftcontract}
          onChange={(e) => setNftContract(e.target.value)}
            placeholder="Contract Address"
          />
          </Box>
          
          <Box display="flex" flexWrap="wrap"  margin="auto" width="-webkit-fill-available" borderRadius="20px"   justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" mt={4} mb={4}>
          <Text>Choose Your Token</Text>
          </Box>

          <Flex width="100%">
    <Box
      bg={selecttoken === 'ERC721' ? 'rgba(84, 88, 98, 0.75)' : 'rgba(34,36,41,1)'}
      border="1px solid #3e424ab3"
      color="white"
      p={4}
      borderRadius="md"
      mr={4}
      mb={4}
      onClick={() => setSelectToken('ERC721')}
      cursor="pointer"
    >
      <Text>ERC-721 Token</Text>
    </Box>
    <Box
      bg={selecttoken === 'ERC20' ? 'rgba(84, 88, 98, 0.75)' : 'rgba(34,36,41,1)'}
      border="1px solid #3e424ab3"
      color="white"
      p={4}
      borderRadius="md"
      mr={4}
      mb={4}
      onClick={() => setSelectToken('ERC20')}
      cursor="pointer"
    >
      <Text>ERC-20 Token</Text>
    </Box>
  </Flex>



          </Box>

          <Box display="flex" flexWrap="wrap"  margin="auto" width="61%" borderRadius="20px"   justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" p={6} mt={9}>
          <Text>Collatorize Your Assets</Text>

          {selecttoken === 'ERC721' && (
            <>
            <Box  display="flex" flexWrap="wrap" margin="auto" width="-webkit-fill-available" borderRadius="20px" justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" mt={4} >
       <Text mb={4}>TokenId</Text>
          <Input
          mb={6}
          bg="rgba(34,36,41,1)"
          border="1px solid #3e424ab3"
          value={tokenid}
          onChange={(e) => setTokenId(e.target.value)}
            placeholder="Collatorize your NFT TokenId"
          />
    </Box>
    <Box display="flex" flexWrap="wrap" flexDirection="column" margin="auto" width="-webkit-fill-available" borderRadius="20px" justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" mt={4} mb={4}>
                <Text mb={4}>Duration</Text>
                <Flex>
    <Button
      colorScheme={duration === 60 ? 'blue' : 'gray'}
      mr={2}
      onClick={() => setDuration(60)}
    >
      1 minutes
    </Button>
    <Button
      colorScheme={duration === 86400 ? 'blue' : 'gray'}
      mr={2}
      onClick={() => setDuration(86400)}
    >
      1 day
    </Button>
    <Button
      colorScheme={duration === 2592000 ? 'blue' : 'gray'}
      onClick={() => setDuration(2592000)}
    >
      30 days
    </Button>
  </Flex>
              </Box>
              <Box display="flex" flexWrap="wrap" margin="auto" width="-webkit-fill-available" borderRadius="20px" justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" mt={4} mb={4}>
                <Text mb={4}>Amount</Text>
                <Input
          mb={6}
          bg="rgba(34,36,41,1)"
          border="1px solid #3e424ab3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount of USDC you want to Borrow"
          />
              </Box>

            </>
    
    
  )}

  {selecttoken === 'ERC20' && (
    <Box display="flex" flexWrap="wrap" margin="auto" width="-webkit-fill-available" borderRadius="20px" justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" mt={4} mb={4}>
      <Text>Hey ERC20 people! Paragraph about ERC20.</Text>
    </Box>
  )}
          
          </Box>

          <Box display="flex" margin="auto" width="max-content" justifyContent="flex-start" bg="rgba(14,14,14,1)" color="white"  mt={8} >
          {loading ? (
    <Spinner size="xl" color="blue.500" /> // Render a spinner or any other loading UI when isLoading is true
  ) : (
    <Button colorScheme="blue" onClick={Borrow} disabled={loading}>
      Get USDC
    </Button>
  )}
        </Box>
    </TabPanel>
    <TabPanel>
    <Box display="flex" flexWrap="wrap"  margin="auto" width="61%" borderRadius="20px"   justifyContent="flex-start" bg="rgba(22,24,28,1)" color="white" p={6} mt={2}>
          <Box  width="100%">
          <Text mb={4}>Enter your Amount</Text>
          <Input
          mb={6}
          bg="rgba(34,36,41,1)"
          border="1px solid #3e424ab3"
          value={swapamount}
          onChange={(e) => setSwapAmount(e.target.value)}
            placeholder="Amount"
          />
          </Box>
          
       

         

          </Box>

          <Box display="flex" margin="auto" width="max-content" justifyContent="flex-start" bg="rgba(14,14,14,1)" color="white"  mt={8} >
          {loading ? (
    <Spinner size="xl" color="blue.500" /> // Render a spinner or any other loading UI when isLoading is true
  ) : (
    <Button colorScheme="blue" onClick={LendUSDC} disabled={loading}>
      Lend USDC
    </Button>
  )}
        </Box>

    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
        </>
      )}
    </Box>
  );
}
