// You should only attempt to request the user's account in response to user
// interaction, such as selecting a button.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account, you should encourage the user
// to initiate the attempt.
const ethereumButton = document.getElementById('connect-button');
const showAccount = document.getElementById('showAccount');
const reloadButton = document.getElementById('reload');
const submitButton = document.getElementById('submit');
let account;
let web3;
let contract_addr = '0x0b18064A4Ac0c5C3edEF5E5FD28645787c08bba2';
let contract_abi = [{"inputs":[],"name":"getData","outputs":[{"components":[{"internalType":"string","name":"mens","type":"string"},{"internalType":"address","name":"eoa","type":"address"}],"internalType":"struct visita.Data[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mensajes","outputs":[{"internalType":"string","name":"mens","type":"string"},{"internalType":"address","name":"eoa","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_msg","type":"string"}],"name":"setData","outputs":[],"stateMutability":"nonpayable","type":"function"}];
let contract;
let confirmaciones=0;



function down(){
  paginacion--;
  if(paginacion<0){
    paginacion=0;
  }
  console.log(paginacion);
  mostrarMensajes();
}
function up() {
  paginacion++;
  if(paginacion > (visitaCom.length/5)){
    paginacion--;
  }
  console.log(paginacion);
  mostrarMensajes();
}


ethereumButton.addEventListener('click', () => {
  getAccount();
});

reloadButton.addEventListener('click', () => {
  readMessages();
});

  // Evento del formulario para agregar mensajes
  document.getElementById('message-form').addEventListener('submit', function(event) {
    event.preventDefault();
    writeMessage();
  });


// While awaiting the call to eth_requestAccounts, you should disable
// any buttons the user can select to initiate the request.
// MetaMask rejects any additional requests while the first is still
// pending.
//https://docs.metamask.io/wallet/how-to/connect/access-accounts/
async function getAccount() {
  web3 = new Web3(window.ethereum);
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
  account = accounts[0];
  showAccount.innerHTML = obtenerSubstringConPuntosSuspensivos(account);
  contract = new web3.eth.Contract(contract_abi, contract_addr);
  readMessages();
}


function obtenerSubstringConPuntosSuspensivos(cadena) {
  if (cadena.length <= 7) {
    return cadena; // Devuelve la cadena completa si tiene 5 caracteres o menos
  } else {
    return cadena.slice(0, 7) + '...'; // Devuelve los primeros 5 caracteres seguidos de puntos suspensivos
  }
}

async function readMessages() {
  visitaCom = await contract.methods.getData().call({from: account});
  mostrarMensajes();
}

async function writeMessage() {
  let msg=document.getElementById("message-input").value;
  contract.methods.setData(msg).send({from: account})
  .on('transactionHash', function(hash){
    alert("Id de la tranaccion= "+hash)
  })
  .on('confirmation', function(confirmationNumber, receipt){
    confirmaciones= confirmationNumber.confirmations.toString();//confirmaciones.confirmations.toString()
  })
  .on('receipt', function(receipt){
    readMessages();
  })
  .on('error', function(error, receipt) { 
    alert("Hubo un error. Intentelo más tarde.");
  });

}