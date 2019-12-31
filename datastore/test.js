const bitcoinClient = require('bitcoin-core');
const userWalletLocation = process.env.userIP;
const asset1WalletLocation = process.env.asset1;
const asset2WalletLocation = process.env.asset2;
const walletPassword="CheckPasswordMrg.txt";
const walletUserName="CheckPasswordMrg.txt";
    
    const Client = new bitcoinClient({ username: walletUserName, password: walletPassword, port:18332, host: 'localhost',network:'testnet'});
		console.log("From assetAsset_idGET. username:" + walletUserName + ";password:" + walletPassword + ";host:" + "127.0.0.1");
		Client.getBalance(function(err, balance) {
			if (err) {
			    return console.error(err);
			}
			console.log('Wallet balance: ' + balance);
		    });
