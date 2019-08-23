'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('DEPLOY');
const uuidV4 = require('uuid/v4');
//const bitcoinClient = require('bitcoin-core');
//const userWalletLocation = process.env.userIP;
const asset1WalletLocation = process.env.asset1;
const asset2WalletLocation = process.env.asset2;
//const walletUserName="elab";
//const walletPassword="Acc3ssGr@nted";
//const walletUserName="Yang";
//const walletPassword="bitpayGE2019";
const walletPassword="Acc3ssGr@nted";
const walletUserName="Ulysseys";
const walletPort="18332";
const walletHost="127.0.0.1";

// Handle file storage
var fileHandle = require('fs');
//var fileStoreRoot = '/public/assetImages/';

var ORM = require('../datastore/ORM.js');

var express = require('express');

logger.setLevel('DEBUG');

const util = require('util');

var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
//TODO: password need to be managed.
//var url = 'blockchain-datastore-build-complete';
var url='127.0.0.1';
//var url = 'localhost';
var port = '5432';
//console.log('connectionStringVar = ' + connectionStringVar);
var connectionString = 'postgres://blockchain:blockchain@' + url +':' + port + '/blockchain';
//var connectionString = 'postgres://postgres:root@' + url + ':' + port + '/blockchainasset';
var db = pgp(connectionString);


var log4js = require('log4js');
var logger = log4js.getLogger('INVOKE');

//var hfc = require('fabric-client');
//var utils = require('fabric-client/lib/utils.js');
//var Peer = require('fabric-client/lib/Peer.js');
//var Orderer = require('fabric-client/lib/Orderer.js');
//var EventHub = require('fabric-client/lib/EventHub.js');

var config = require('../config.json');
//var helper = require('../helper.js');

logger.setLevel('DEBUG');

//var client = new hfc();
var client;
var chain = null;
;
var eventhub;
var tx_id = null;

//init();

function init() {
    logger.info('Empty initialization -- without doing anything');
/*
    logger.info('Exec init from DefaultService.js');
    chain = client.newChain(config.chainName);
    chain.addOrderer(new Orderer(config.orderer.orderer_url));
    eventhub = new EventHub();
    eventhub.setPeerAddr(config.events[0].event_url);
    eventhub.connect();
    for (var i = 0; i < config.peers.length; i++) {
        chain.addPeer(new Peer(config.peers[i].peer_url));
    }
*/
}

exports.assetsOwnerOwner_idGET = function (args, res, next) {
    /**
     * Gets all `Asset` for asset owner.
     *
     * owner_id String the owner unique id
     * returns List
     **/
    /*
     var examples = {};
     examples['application/json'] = [ {
     "user_id" : "aeiou",
     "owner_id" : "aeiou",
     "assetName" : "aeiou",
     "created_at" : "aeiou",
     "description" : "aeiou",
     "id" : "aeiou"
     } ];
     if (Object.keys(examples).length > 0) {
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
     } else {
     res.end(); }
     */
    var ownerID = parseInt(args.owner_id.value);
    var queryString = 'select a.id id, a.assetName assetName, u.firstName userFirstName, u.lastName userLastName, o.firstName ownerFirstName,' +
        'o.lastName ownerLastName, a.created_at created_at, a.description description ' +
        'from assets a, users u, users o where a.owner_id = $1 and a.owner_id = o.id and a.user_id = u.id order by id';
    db.any(queryString, ownerID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}


exports.assetsUserUser_idGET = function (args, res, next) {
    /**
     * Gets all `Asset` for asset owner.
     *
     * user_id String the user unique id
     * returns List
     **/
    /*
     var examples = {};
     examples['application/json'] = [ {
     "user_id" : "aeiou",
     "owner_id" : "aeiou",
     "assetName" : "aeiou",
     "created_at" : "aeiou",
     "description" : "aeiou",
     "id" : "aeiou"
     } ];
     if (Object.keys(examples).length > 0) {
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
     } else {
     res.end();
     }
     */

	    logger.info("Enter parsing post");

    var userID = parseInt(args.user_id.value);
    var queryString = 'select a.id id, a.assetName assetName, u.firstName userFirstName, u.lastName userLastName, o.firstName ownerFirstName,' +
        'o.lastName ownerLastName, a.created_at created_at, a.description description , u.wallet wallet ' +
        'from assets a, users u, users o where a.user_id = $1 and a.owner_id = o.id and a.user_id = u.id order by id';

    db.any(queryString, userID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
	    logger.info("Enter parsing post");

            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.assetAsset_idStateGET = function (args, res, next) {
    /**
     * Get `asset` `state` by asset id
     *
     * asset_id String the asset id
     * returns state
     **/
    /*var examples = {};
     examples['application/json'] = {
     "state_type" : "aeiou",
     "id" : "aeiou",
     "asset_id" : "aeiou",
     "person_id" : "aeiou"
     };*/
    var assetID = parseInt(args.asset_id.value);
    var queryString = 'select asset_uuid from assets where id = $1';
    db.any(queryString, assetID)
        .then(function (data) {
                var uuid = JSON.stringify(data[Object.keys(data)[0]].asset_uuid || {}, null, 2);
                return uuid;
            }
        )
/*
        .then(function (uuid) {
            // Get status from hyperledger
            logger.info("client = new hfc()");
            //client = new hfc();
            //init();

            hfc.newDefaultKeyValueStore({
                path: config.keyValueStore
            }).then(function (store) {
                client.setStateStore(store);
                return helper.getSubmitter(client);
            }).then(
                function (admin) {
                    logger.info('Successfully obtained user to submit transaction');
                    tx_id = utils.buildTransactionID();
                    var uuidWithoutQuotes = uuid.substr(1, uuid.length - 2);
                    var args =
                        [
                            'query',
                            uuidWithoutQuotes
                        ];
                    logger.info(uuidWithoutQuotes);
                    var functionName = "invoke";
                    var targets = [];
                    var request = {
                        targets: targets,
                        chaincodeId: config.chaincodeID,
                        chainId: config.channelID,
                        fcn: functionName,
                        args: args,
                        nonce: utils.getNonce(),
                        txId: tx_id,
                    };
                    // Query chaincode
                    logger.info('Right before query');
                    return chain.queryByChaincode(request);
                }
            )
	.then(
                function (response_payloads) {
                    for (let i = 0; i < response_payloads.length; i++) {
                        logger.info('############### Query results ', response_payloads[i].toString('utf8'));
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(response_payloads[0].toString('utf8'));
                }
            ).catch(
                function (err) {
                    logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
                }
            );
        })
*/
}

/*
exports.assetAsset_idTransferFundsAmountReceivingAddressPOST = function (args, res, next) {
    var assetID = parseInt(args.asset_id.value);
    var amount = args.amount.value;
    var receivingAddress = args.address.value;
    var comment = 'a comment';
    var comment2 = 'a comment about who the payment was sent to';

    var queryString = 'SELECT a.wallet AS assetWallet FROM assets a WHERE a.id= ' +args.asset_id.value ;
    db.any(queryString)
    .then(function (data) {
	    const assetWallet = data[Object.keys(data)[0]].assetwallet;  // get location of asset's wallet
//	    const assetClient = new bitcoinClient({ username: walletUserName, password: walletPassword, host: assetWallet });
	    const assetClient = new bitcoinClient({ username: walletUserName, password: walletPassword, host:'127.0.0.1', network:'testnet', port:walletPort });

	    assetClient.sendToAddress(receivingAddress, amount, comment, comment2, function(err, txid) {
		    if (err) {
			return console.error(err);
		    }
		    res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({id: 1, txid: txid}, null, 2));
		    console.log('Moving ' +amount + ' to receiving address: ' + receivingAddress + " tx id:" + txid);
	    });
    });
}
*/

exports.assetAsset_idGET = function (args, res, next) {
    /**
     * Get single `Asset` by asset id
     *
     * asset_id String the asset id
     * returns asset
     **/

//   examples['application/json'] = {
//   "user_id" : "aeiou",
//   "owner_id" : "aeiou",
//   "assetName" : "aeiou",
//   "created_at" : "aeiou",
//   "description" : "aeiou",
//   "id" : "aeiou"
// };
    var assetID = parseInt(args.asset_id.value);
    var queryString = 'select a.id id, a.uuid assetUUID, a.assetName assetName, u.firstName userFirstName, u.lastName userLastName, u.firstName ownerFirstName,  u.lastName ownerLastName, a.created_at created_at, a.am_description description, a.location_description locationDescription, a.dimension1 d1, a.dimension2 d2, a.dimension3 d3, a.location loc from assets a, users u where a.id = $1 and a.owner_id = u.id';
    console.log('From assetAsset_idGET.  queryString: ' + queryString);
    db.any(queryString, assetID)
        .then(function (data) {

		//const assetWallet = data[Object.keys(data)[0]].walletaddress;  // get location of asset's wallet      
		//const Client = new bitcoinClient({ username: walletUserName, password: walletPassword, host: assetWallet });
		//const Client = new bitcoinClient({ username: walletUserName, password: walletPassword, host: walletHost, network:'testnet',port:walletPort});
		//console.log("From assetAsset_idGET. username:" + walletUserName + ";password:" + walletPassword + ";host:" + "127.0.0.1");
        /*
        Client.getBalance(function(err, balance) {
			if (err) {
			    return console.error(err);
			}
			logger.info('Wallet balance: ' + balance);

			data[0].coinsRemaining = balance;

			logger.info(data);

			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
            });
            */

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}

// Integration of the Hyperledger
exports.assetCreatePOST = function (args, res, next) {
    /**
     * Create a single `Asset`
     *
     * body Asset asset object to be added to the database
     * returns asset
     **/
    /*
     var examples = {};
     examples['application/json'] = {
     "user_id" : "aeiou",
     "owner_id" : "aeiou",
     "assetName" : "aeiou",
     "created_at" : "aeiou",
     "description" : "aeiou",
     "id" : "aeiou"
     */
    var body = args.body;
    var assetName = body.originalValue.assetName;
    var assetDesc = body.originalValue.description;
    var createDate = body.originalValue.created_at;
    var owner_id = body.originalValue.owner_id;
    // Need to check if the user _id is null?
    var user_id = body.originalValue.user_id;
    var assetWallet = body.originalValue.walletAddress;

    // UUID will be generated here in the js.
    uuidV4
    //var uuid = '123e4567-e89b-12d3-a456-426655440000';
    var uuid = uuidV4();

    //logger.info("client = new hfc()");
    //client = new hfc();
    //var chain = null;;
    //var eventhub;
    //var tx_id = null; 

    init();
    /*
     if (chain==null) {
     logger.info("chain==null, call init from assetCreatePost");
     client = new hfc();
     init();
     }
     */
    /*------------------------------------------------------------------------------------------------------*/
/*
    hfc.newDefaultKeyValueStore({
        path: config.keyValueStore
    }).then(function (store) {
        client.setStateStore(store);
        return helper.getSubmitter(client);
    }).then(
        function (admin) {
            logger.info('Successfully obtained user to submit transaction');

            logger.info('Executing Invoke');
            tx_id = helper.getTxId();
            //var nonce = utils.getNonce();
            //var args = helper.getArgs(config.invokeRequest2.args);
            var args =
                [
                    'born',
                    uuid,
                    owner_id
                ];
            // send proposal to endorser
            var functionName = "invoke"
            var request = {
                chaincodeId: config.chaincodeID,
                fcn: functionName,
                args: args,
                nonce: utils.getNonce(),
                chainId: config.channelID,
                txId: tx_id,
            };
            return chain.sendTransactionProposal(request);
        }
    ).then(
        function (results) {
            logger.info('Successfully obtained proposal responses from endorsers');

            return helper.processProposal(chain, results, 'active');
        }
    ).then(
        function (response) {
            if (response.status === 'SUCCESS') {
                var handle = setTimeout(() => {
                        logger.error('Failed to receive transaction notification within the timeout period');
                process.exit(1);
            },
                parseInt(config.waitTime)
            )
                ;

                eventhub.registerTxEvent(tx_id.toString(), (tx) => {
                    logger.info('The chaincode transaction has been successfully committed');
                clearTimeout(handle);
                eventhub.disconnect();
            })
                ;
            }
        }
    ).catch(
        function (err) {
            eventhub.disconnect();
            logger.error('Failed to invoke transaction due to error: ' + err.stack ? err.stack : err);
        }
    );
*/

    /*------------------------------------------------------------------------------------------------------*/

    db.any('insert into assets(asset_uuid, assetname, created_at, description, owner_id, user_id, wallet)' +
	   'values($1, $2, CURRENT_DATE, $4, $5, $6, $7); SELECT currval(\'assets_id_seq\') id', [uuid, assetName, createDate, assetDesc, owner_id, user_id, assetWallet])
        .then(function (data) {
            //ToDo should this method return anything?
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
            //ToDo create an asset in hyperledger
        })
        .catch(function (err) {
            return next(err);
        });
};

exports.personPOST = function (args, res, next) {
    /**
     * Post a person's information
     *
     **/
    var body = args.body;
    var userName = body.originalValue.userName;
    var firstName = body.originalValue.firstName;
    var lastName = body.originalValue.lastName;
    var email = body.originalValue.email;
    var companyName = body.originalValue.companyName;
    var wallet = body.originalValue.walletAddress;

    db.any('insert into users(userName, firstName, lastName, email, companyName, created_at, wallet)' +
	   'values($1, $2, $3, $4, $5, CURRENT_DATE, $6) ; SELECT currval(\'user_id_seq\') id;', [userName, firstName, lastName, email, companyName, wallet])
        .then(function (data) {
            //ToDo should this method return anything?
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}
exports.personPerson_idGET = function (args, res, next) {
    /**
     * Gets the `person` by person id
     *
     * person_id String the user unique id
     * returns person
     **/
    /*    var examples = {};
     examples['application/json'] = {
     "firstName" : "aeiou",
     "lastName" : "aeiou",
     "companyName" : "aeiou",
     "created_at" : "aeiou",
     "id" : "aeiou",
     "userName" : "aeiou",
     "email" : "aeiou"
     };*/
    var personID = parseInt(args.person_id.value);
    db.any('select * from users WHERE id=$1', personID)
        .then(function (data) {


	    console.error(Object.keys(data));
            console.error(Object.keys(data)[0]);
            console.error(data[Object.keys(data)[0]].wallet);
            const assetWallet = data[Object.keys(data)[0]].wallet;  // get location of user's wallet     
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        /*

	    //const host = JSON.stringify(data[Object.keys(data)[8]]);  // select from user or assert and get wallet string
	    const Client = new bitcoinClient({ username: walletUserName, password: walletPassword, host: assetWallet,port:walletPort});

	    Client.getBalance(function(err, balance) {
		    if (err) {
			return console.error(err);
		    } 
		    logger.info('Wallet balance: ' + balance);

		    data[0].coinsRemaining = balance;

		    logger.info(data);

		    res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
	    }); */
        })
        .catch(function (err) {
            return next(err);
        });
}


exports.assetAsset_idImageGET = function (args, res, next) {
    /**
     * Get `assetImage` by image id
     *
     * asset_id String the asset id
     * returns assetImage
     **/
//   examples['application/json'] = {
//   "assetId" : "aeiou",
//   "id" : "aeiou",
//   "url" : "aeiou"
//
        //How: the image file of the related asset will be path will be queried from the database,
        //      and copied from the image repository to public/,
        //      (that is defined as the temperary image locatioy),  then url will be returned as part of response.

        // Get image path
    var assetID = parseInt(args.asset_id.value);

    db.any('select id, asset_id assetId, image_url url from asset_images where asset_id = $1', assetID)
        .then(function (data) {

            var query_results = JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2);
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });

};

exports.usersOwner_idGET = function (args, res, next) {
    /**
     * Gets all `user` by the owner id.
     *
     * owner_id String the owner unique id
     * returns List
     **/
    /*
     var examples = {};
     examples['application/json'] = [ {
     "firstName" : "aeiou",
     "lastName" : "aeiou",
     "companyName" : "aeiou",
     "created_at" : "aeiou",
     "id" : "aeiou",
     "userName" : "aeiou",
     "email" : "aeiou"
     } ];
     if (Object.keys(examples).length > 0) {
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
     } else {
     res.end();
     }
     */

    var ownerID = parseInt(args.owner_id.value);
    var queryString = 'select distinct on (u,id) u.id id, u.userName userName, u.firstName firstName, u.lastName lastName, u.email email,' +
        'u.companyName companyName, u.created_at created_at ' +
        'from assets a, users u, users o where o.id = $1 and a.owner_id = o.id and a.user_id = u.id';
    db.any(queryString, ownerID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
            //res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });


}
exports.usersOwner_idPOST = function (args, res, next) {
    /**
     * Post a person's information
     *
     **/
    var body = args.body;
    var userName = body.originalValue.userName;
    var firstName = body.originalValue.firstName;
    var lastName = body.originalValue.lastName;
    var email = body.originalValue.email;
    var companyName = body.originalValue.companyName;

    db.any('insert into users(userName, firstName, lastName, email, companyName, created_at, wallet)' +
	   'values($1, $2, $3, $4, $5, CURRENT_DATE, $6) ; SELECT currval(\'user_id_seq\') id;', [userName, firstName, lastName, email, companyName, userWalletLocation])
        .then(function (data) {
            //ToDo should this method return anything?
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}
/*
exports.usersOwner_idDepositAsset_idPOST  = function (args, res, next) {
    ////here
    //get asset's wallet
    var queryString = 'SELECT u.wallet AS userWallet, a.wallet AS assetWallet FROM users u, assets a WHERE u.id= ' +args.user_id.value + ' AND a.id= ' +args.asset_id.value ;
    db.any(queryString)
    .then(function (data) {
	    //	    const host = JSON.stringify(data[Object.keys(data)[10]]);
	    const userWallet = data[Object.keys(data)[0]].userwallet;  // get location of user's wallet
	    const userClient = new bitcoinClient({ username: walletUserName, password: walletPassword, host: userWallet, port:walletPort});	

	    const assetWallet = data[Object.keys(data)[0]].assetwallet;  // get location of asset's wallet
	    const assetClient = new bitcoinClient({ username: walletUserName, password: walletPassword, host: assetWallet });

       	console.log('userWallet: ' + userWallet);
	    console.log('assetWallet: ' + assetWallet);
	    console.log('userClient: ' + userClient);
	    console.log('assetClient: ' + assetClient);

	    assetClient.getNewAddress(function(err, address) {
		    if (err) {
			return console.error(err);
		    }
		    console.log('Wallet receiving address: ' + address);
		    var amount = args.amount.value;
		    var comment = 'a comment';
		    var comment2 = 'a comment about who the payment was sent to';

		    userClient.sendToAddress(address, amount, comment, comment2, function(err, txid) {
			    if (err) {
				return console.error(err);
			    }
			    res.setHeader('Content-Type', 'application/json');
			    res.end(JSON.stringify({id: 1, txid: txid}, null, 2));
			    console.log('Moving ' +amount + ' to receiving address: ' + address + " tx id:" + txid);
		    });
	    });
    })
    .catch(function (err) {
	    return next(err);
    });

}
*/

exports.assetImagePOST = function (args, res, next) {
    /**
     * Upload or change `assetImage`
     *
     * body File the image
     * returns assetImage
     **/

        //console.log("Body: " + JSON.stringify(body));
        //var admin = express();
    var app = require('express')();
    console.log("node address: " + app.get('url'));
    console.log('The mount directory of node:' + __dirname);
    var imageFileName = args.body.originalValue.originalname;
    var imageFile = args.body.originalValue.buffer;
    //var outputFileName = fileStoreRoot + imageFileName;
    //var outputFileName = __dirname + '/../public/assetImages/' + imageFileName;

    var outputFileName = 'public/assetImages/' + imageFileName;
    var outputStream = fileHandle.writeFile(outputFileName, imageFile, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

    var assetID = parseInt(args.asset_id.value);

    var image_url_name = imageFileName;
    db.any('insert into asset_images(asset_id, image_url)' +
        'values($1, $2)', [assetID, image_url_name])
        .then(function (data) {
            //ToDo should this method return anything?

            res.setHeader('Content-Type', 'application/json');
            //ToDo set responce status code to 201
            //var test = JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2);
            //console.log("test=" + test);
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.assetsAllAvailableAssetsGET = function (args, res, next) {

    var queryString = 'select * from assets';
    db.any(queryString)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.personsAllAvailablePersonsGET = function (args, res, next) {

    var queryString = 'select * from users';
    db.any(queryString)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

function invoke(args) {
	logger.info("Enter invoke");

/*
    logger.info("client = new hfc()");
    client = new hfc();
    init();

    var tx_id = null;
    var message;
    hfc.newDefaultKeyValueStore({
        path: config.keyValueStore
    }).then(function (store) {
        client.setStateStore(store);
        return helper.getSubmitter(client);
    }).then(function (admin) {
        logger.info('Successfully obtained user to submit transaction');
        logger.info('Executing Invoke');
        tx_id = helper.getTxId();
        var nonce = utils.getNonce();
        //var args = helper.getArgs(config.invokeRequest.args);
        // send proposal to endorser
        var request = {
            chaincodeId: config.chaincodeID,
            fcn: "invoke",
            args: args,
            chainId: config.channelID,
            txId: tx_id,
            nonce: nonce
        };

        //promise.try(function () {
            // How to chatch exception for the chain related functions.
            return chain.sendTransactionProposal(request);
        //}).
        // catch(
        //     function (err) {
        //         eventhub.disconnect();
        //         logger.info('*******************Failed to invoke transaction due to error: ' + err.stack ? err.stack : err);
        //         message = "Transaction failed."
        //     }
        // )
    }).then(function (results) {
        logger.info('Successfully obtained proposal responses from endorsers');
        //promise.try(function () {
            return helper.processProposal(chain, results, 'active');
        //})
    }).catch(
        function (err) {
            eventhub.disconnect();
            logger.info('----------------Failed to invoke transaction due to error: ' + err.stack ? err.stack : err);
            message = "Transaction failed."
        }
    ).then(function (response) {
            if (response.status === 'SUCCESS') {
                var handle = setTimeout(() => {
                        logger.error('Failed to receive transaction notification within the timeout period');
                process.exit(1);
            },
                parseInt(config.waitTime)
            )
                ;
                eventhub.registerTxEvent(tx_id.toString(), (tx) => {
                    logger.info('The chaincode transaction has been successfully committed');
                clearTimeout(handle);
                eventhub.disconnect();
            })
                ;
                //message = "Trasaction successful."
                return "Transaction successful";
            }
        }
    ).catch(
        function (err) {
            eventhub.disconnect();
            logger.info('Failed to invoke transaction due to error: ' + err.stack ? err.stack : err);
            message = "Transaction failed."
        }
    );
    //return message;
*/
}



exports.eventPOST = function (args, res, next) {
    /**
     * Post an `asset` `event`
     *
     * body Event the event object
     * returns event
     **/
    /*
     var examples = {};
     examples['application/json'] = {
     "eventInfo" : "{}",
     "created_at" : "aeiou",
     "id" : "aeiou",
     "eventType" : "aeiou",
     "asset_id" : "aeiou",
     "person_id" : "aeiou"
     };
     */
    logger.info("Enter event post");

    var body = args.body;
    var eventType = body.originalValue.eventType;
    // Person id is used as owner id
    var person_id = body.originalValue.person_id;
    var assetID = body.originalValue.asset_id;
    var eventInfo = body.originalValue.eventInfo;
    var createDate = body.originalValue.created_at;
    var functionName = "invoke";
    var message;
    var args;

    logger.info("Event type: " + eventType);
    var queryString = 'select asset_uuid from assets where id = $1';
        db.any(queryString, assetID)
            .then(function (data) {
                    var uuid1 = JSON.stringify(data[Object.keys(data)[0]].asset_uuid || {}, null, 2);
                    var uuid = uuid1.substr(1, uuid1.length - 2);

                    if (eventType == "initialize") {

                        // {
                        //     "id": "1",
                        //     "eventType": "initialize",
                        //     "person_id": "1",
                        //     "asset_id": "40",
                        //     "created_at": "2017-4-6",
                        //     "eventInfo": {"token":"6"}
                        // }

                        var token = eventInfo.token;
                        args = ["initialize", uuid, person_id, token];
                        return args;
                    }
                    else if (eventType == "turn on") {
                        // {
                        //     "id": "1",
                        //     "eventType": "turn on",
                        //     "person_id": "1",
                        //     "asset_id": "40",
                        //     "created_at": "2017-4-6",
                        //     "eventInfo": {}
                        // }
                        args = ["turnon",uuid];
                        return args;
                    }
                    else if (eventType == "turn off") {
                        args = ["turnoff",uuid]
                        return args;
                    }
                    else {
                        res.setHeader('Content-Type', 'application/json');
                        res.end("No eventType: " + eventType);
                        return null;
                    }
            })
            .then(function (data) {

                // var d = require('domain').create();
                // d.on('error', function(err){
                //     // handle the error safely
                //     logger.info(err)
                // })
                //
                // // catch the uncaught errors in this asynchronous or synchronous code block
                // d.run(function(){
                //     // the asynchronous or synchronous code that we want to catch thrown errors on
                //
                //     if (data!=null) err = invoke(data);
                //     else var newError = new Error("Error from DefaultServices.js: " + err);
                //     throw newError;
                //
                //     if (err==null)
                //         message = "Action performed"
                //     else throw err;
                //     //var err = new Error('example')
                //     //throw err
                // })

                //var p = require('Promise');
                promise.try(function () {

                    if (data != null) message = invoke(data);
                    else message = "Eventtype: " + eventType + " not implemented";
                    //    throw new Error("Something");
                }).catch(
                    // function(err){
                    //         console.log(err.message); // logs "Something"
                    //     });
                    //
                    // })
                    // .catch(
                    function (err) {
                        eventhub.disconnect();
                        logger.error('Failed to invoke transaction due to error: ' + err.stack ? err.stack : err);
                        message = "Transaction failed."
                    })
                    .then(function () {

                        var argsString = args.toString();
                        logger.info("Before db insert");
                        db.any('insert into events(asset_id, user_id, eventType, eventParameter, created_at)' +
                            'values($1, $2, $3, $4, $5); SELECT currval(\'event_id_seq\') id', [assetID, person_id, eventType, argsString,createDate])
                            .then(function (data) {
                                //ToDo should this method return anything?
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
                                //ToDo create an asset in hyperledger
                            })
                            .catch(function (err) {
                                logger.info("Err: " + err.toString());
                                return next(err);
                            });

                        // logger.info("Come to the end of the eventPOST. message: " + message);
                        // res.setHeader('Content-Type', 'application/json');
                        // res.end(message);
                    });
            })



    }


    // Need to finalize all the status when the state machine is done.
exports.assetsAllStatesGET = function (args, res, next) {
    var allStates = " [\"exists\",\"off\",\"on\",\"maintenance\"] ";
    res.setHeader('Content-Type', 'application/json');
    logger.info("All states: " + allStates);
    res.end(allStates);
}

exports.eventEvent_idGET = function (args, res, next){

    //var body = args.body;
    var eventID = parseInt(args.event_id.value);

    logger.info("eventID: " + eventID);
    var queryString = 'select * from events where id = $1';
    db.any(queryString,eventID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.eventsPerson_idGET = function (args, res, next) {
    /**
     * Gets all `Asset` for asset owner.
     *
     * owner_id String the owner unique id
     * returns List
     **/
    /*
     var examples = {};
     examples['application/json'] = [ {
     "user_id" : "aeiou",
     "owner_id" : "aeiou",
     "assetName" : "aeiou",
     "created_at" : "aeiou",
     "description" : "aeiou",
     "id" : "aeiou"
     } ];
     if (Object.keys(examples).length > 0) {
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
     } else {
     res.end(); }
     */
    var personID = parseInt(args.person_id.value);
    var queryString = 'select e.id id, e.eventType eventType, a.assetName assetName, p.firstName personFirstName, p.lastName personLastName, e.created_at created_at ' + 
        'from assets a, users p, events e where e.user_id = $1 and p.id = e.user_id and a.id = e.asset_id order by id';
    db.any(queryString, personID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.eventsAllAvailableEventsGET = function (args, res, next) {

    var queryString = 'select * from events';
    db.any(queryString)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.eventsAsset_idGET = function (args, res, next) {
    /**
     * Gets all `Asset` for asset owner.
     *
     * owner_id String the owner unique id
     * returns List
     **/
    /*
     var examples = {};
     examples['application/json'] = [ {
     "user_id" : "aeiou",
     "owner_id" : "aeiou",
     "assetName" : "aeiou",
     "created_at" : "aeiou",
     "description" : "aeiou",
     "id" : "aeiou"
     } ];
     if (Object.keys(examples).length > 0) {
     res.setHeader('Content-Type', 'application/json');
     res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
     } else {
     res.end(); }
     */
    var assetID = parseInt(args.asset_id.value);
    var queryString = 'select e.id id, e.eventType eventType, a.assetName assetName, p.firstName personFirstName, p.lastName personLastName, e.created_at created_at ' + 
        'from assets a, users p, events e where e.asset_id = $1 and p.id = e.user_id and a.id = e.asset_id order by id';
    db.any(queryString, assetID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.eventsUserAsset_idGET = function (args, res, next) {
    var assetID = parseInt(args.asset_id.value);
    var queryString = 'select e.id id, e.eventType eventType, a.assetName assetName, p.firstName personFirstName, p.lastName personLastName, e.created_at created_at ' + 
        'from assets a, users p, events e where e.asset_id = $1 and e.user_id = 2 and p.id = e.user_id and a.id = e.asset_id order by id';
    db.any(queryString, assetID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}


exports.eventsUserQueueElementPOST = function(args, res, next) {
    var name = args.body.originalValue.name;
    var assetid = args.body.originalValue.assetid;
    var status = 'Queued';
    var percentComplete = 0;
    var sku = args.body.originalValue.sku;
    var price = parseFloat(args.body.originalValue.price);
    var dimension1 = parseFloat(args.body.originalValue.dimension1);
    var dimension2 = parseFloat(args.body.originalValue.dimension2);
    var dimension3 = parseFloat(args.body.originalValue.dimension3);
    var ordernumber = args.body.originalValue.ordernumber;
    var location = args.body.originalValue.location;
    
    db.any('insert into queue(id, name, assetid, status, percentcomplete, sku, price, dimension1, dimension2, dimension3, ordernumber, location)' +
        'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11); SELECT currval(\'queue_id_seq\') id;', [name, assetid, status, percentComplete, sku, price, dimension1,dimension2, dimension3, ordernumber, location])
        .then(function (data) {
            //ToDo should this method return anything?
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.eventsAssetMarketplacePOST = function(args, res, next) {
    logger.info("Enter parsing post");
    var assetID = args.body.originalValue.assetID.value;
    logger.info("parsed asset id");
    var credentialID = args.body.originalValue.credentialID.value;
    logger.info("parsed cred id");
    var marketplaceName = args.body.originalValue.marketplaceName.value;
    logger.info("done parsing");

    db.any('insert into assetCredential(assetID,credentialID,marketPlace)' +
        'values($1,$2,$3); SELECT currval(\'asset_credential_id_seq\') id;', [assetID, credentialID, marketplaceName])
        .then(function (data) {
            //ToDo should this method return anything?
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.marketProductItemsGET = function(args, res, next) {

var http = require('https');
var data = JSON.stringify({
  'username': 'admin1',
  'password':'Acc3ssGr@nted'
});

//var host = process.env.magento;
var host = 'digitaltrustnexus.net'
var port = '443';
var path = '/market/rest/V1/integration/admin/token';
var method = 'POST';
var contentType = 'application/json';
var options1 = new Object();
var header1 = new Object();
header1['Content-Type'] = contentType;

options1['host']=host;
options1['port']=port;
options1['path']=path;
options1['method']=method;
options1['headers']=header1;

var token = null;
var req = http.request(options1, function(res) {
  var msg = '';
  console.log('request 1');
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    msg += chunk;
  });
  res.on('end', function() {
    //token = JSON.parse(msg);
    //logger.info('Token = ' + token);
    console.log('returned message = ' + msg);
    token = msg;
  });
});

req.write(data);
req.end();


var sync = require('deasync');
while(token==null) {sync.sleep(50);}

var options2 = new Object();
options2['host']=host;
options2['port']=port;
path = '/market/rest/V1/products?searchCriteria=\'\'';
options2['path']=path;
options2['method']='GET';
header1['Authorization']='Bearer ' + token;
logger.info('authorization data ' + header1.Authorization);
options2['headers']=header1;
var parameter = new Object();

var products;
var req2 = http.request(options2, function(res) {
  var msg = '';
  console.log('request 2');
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    msg += chunk;
  });
  res.on('end', function() {
    products = JSON.parse(msg);
    console.log('path: ' + options2['path']);
    console.log('return from second request:'+msg);
    //logger.info(products);
    //products = Buffer.concat(msg).toString();
  });
});
req2.write(data);
req2.end();

	    var sync1 = require('deasync');
	    while(products==null) {sync.sleep(50);}
            res.setHeader('Content-Type', 'application/json');
            var body  = '[\n';
            for (var i=0;i<products.items.length;i++) {
                console.log(i);
                console.log(body);
                if (products.items[i].status==1) {
                    body = body + JSON.stringify(products.items[i] || {}, null, 2);
                    if (i != products.items.length - 1) body = body + ",";
                }
            }
            body = body + ']';
            console.log('final: ',body);
            //logger.info("products right before sending it out:" + JSON.stringify(products.items));
            res.end(body);

}

exports.allQueueElementsGET = function (args, res, next) {
    var queryString = 'select * from queue order by queue.id';
    db.any(queryString)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.availableQueueElementsGET = function (args, res, next) {
/*
    var location = args.body.originalValue.location;
    var dimension1 = args.body.originalValue.dimension1;
    var dimension2 = args.body.originalValue.dimension2;
    var dimension3 = args.body.originalValue.dimension3;
*/

    var location = args.location.value;
    var dimension1 = parseInt(args.dimension1.value);
    var dimension2 = parseInt(args.dimension2.value);
    var dimension3 = parseInt(args.dimension3.value);

    var queryString = 'select * from queue where queue.percentComplete = 0 and' +
        ' location = \'' + location + '\' and dimension1 <= ' + dimension1 +
        ' and dimension2 <= ' + dimension2 +
        ' and dimension3 <= ' + dimension3 + ' order by queue.id';
    console.log("queryString:   " + queryString);

    db.any(queryString)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            for (var i = 0; i < data.length; i++) {
                response = response + JSON.stringify(data[Object.keys(data)[i]] || {}, null, 2);
                if (i != data.length - 1) response = response + ",";
            }
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.queueAssetChangeElementStatusPOST = function(args, res, next) {
    var status = args.body.originalValue.status;
    var percentComplete = parseInt(args.body.originalValue.percentComplete);
    var assetID = parseInt(args.asset_id.value);
    var elementID = parseInt(args.element_id.value);
    var queryString = 'update queue set status=$1, percentComplete=$2, assetID=$3 where id=$4' 
    db.any(queryString, [status, percentComplete, assetID, elementID])
        .then(function (data) {
            //ToDo should this method return anything?
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.queueElementStatusAsset_idGET = function (args, res, next) {
    var assetID = parseInt(args.asset_id.value);
    var queryString = 'select q.status status, q.percentComplete percentComplete ' + 
        'from queue q where q.assetID = $1 order by q.priorityNum';
    db.any(queryString, assetID)
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            var response = '[\n';
            //for (var i = 0; i < data.length; i++) {
                var response = response + JSON.stringify(data[Object.keys(data)[data.length-1]] || {}, null, 2);
                //if (i != data.length - 1) response = response + ",";
            //}
            response = response + ']';
            res.end(response);
        })
        .catch(function (err) {
            return next(err);
        });
}
