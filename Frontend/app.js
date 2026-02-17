let provider;
let signer;
let contract;

const contractAddress = "0xe042F2F86e076157Da3F5AC5Ee10D1524684cD01";

const abi = [
  "function addCandidate(string memory _name) public",
  "function candidateCount() view returns (uint)",
  "function candidates(uint) view returns (uint id, string name, uint voteCount)"
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const account = await signer.getAddress();
  document.getElementById("account").innerText =
    "Connected: " + account;

  contract = new ethers.Contract(contractAddress, abi, signer);

  await loadCandidates();
}

async function addCandidate() {
  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  const name = document.getElementById("candidateName").value;

  if (!name) {
    alert("Enter candidate name");
    return;
  }

  try {
    const tx = await contract.addCandidate(name);
    await tx.wait();

    document.getElementById("candidateName").value = "";

    await loadCandidates();
  } catch (err) {
    console.error(err);
    alert(err.reason || err.message);
  }
}

async function loadCandidates() {
  if (!contract) return;

  const count = await contract.candidateCount();
  const list = document.getElementById("candidateList");
  list.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const candidate = await contract.candidates(i);

    const li = document.createElement("li");
    li.innerHTML =
      "<strong>" + candidate.id + ". " + candidate.name + "</strong>" +
      " | Votes: " + candidate.voteCount;

    list.appendChild(li);
  }
}
