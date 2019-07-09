'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('DEPLOY');

var hfc = require('fabric-client');
var utils = require('fabric-client/lib/utils.js');
var Peer = require('fabric-client/lib/Peer.js');
var Orderer = require('fabric-client/lib/Orderer.js');
var EventHub = require('fabric-client/lib/EventHub.js');

var config = require('./config.json');
var helper = require('./helper.js');
var ORM = require('../datastore/ORM.js');

logger.setLevel('DEBUG');

const util = require('util')

var client = new hfc();
var chain;
var eventhub;

if (!process.env.GOPATH){
    process.env.GOPATH = config.goPath;
    logger.info('Setting GO PATH to %s.', process.env.GOPATH);
}

init();

function init() {
    chain = client.newChain(config.chainName);
    chain.addOrderer(new Orderer(config.orderer.orderer_url));
    eventhub = new EventHub();
    eventhub.setPeerAddr(config.events[0].event_url);
    eventhub.connect();
    for (var i = 0; i < config.peers.length; i++) {
        chain.addPeer(new Peer(config.peers[i].peer_url));
    }
}


var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/blockchainasset';
var db = pgp(connectionString);

exports.assetAsset_idGET = function(args, res, next) {
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
    db.any('select * from assets WHERE id=$1', assetID)
        .then(function (data) {
            //ToDo lookup owner_id and user_id in hyperledger

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });
}

exports.assetAsset_idImageGET = function(args, res, next) {
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
// };

    var assetID = parseInt(args.asset_id.value);
    db.any('select * from asset_images WHERE asset_id=$1', assetID)
        .then(function (data) {
            //ToDo lookup owner_id and user_id in hyperledger

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
        })
        .catch(function (err) {
            return next(err);
        });


  //
  //   if (Object.keys(examples).length > 0) {
  //   res.setHeader('Content-Type', 'application/json');
  //   res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  // } else {
  //   res.end();
  // }
}

exports.assetAsset_idStateGET = function(args, res, next) {
  /**
   * Get `asset` `state` by asset id 
   *
   * asset_id String the asset id
   * returns state
   **/
  var examples = {};
  examples['application/json'] = {
  "state_type" : "aeiou",
  "id" : "aeiou",
  "asset_id" : "aeiou",
  "person_id" : "aeiou"
};



    hfc.newDefaultKeyValueStore({
        path: config.keyValueStore
    }).then(function(store) {
        client.setStateStore(store);
        return helper.getSubmitter(client);
    }).then(
        function(admin) {
            logger.info('Successfully obtained enrolled user to perform query');

            logger.info('Executing Query');
            var targets = [];
            for (var i = 0; i < config.peers.length; i++) {
                targets.push(config.peers[i]);
            }
            var args = helper.getArgs(config.queryRequest.args);
            //chaincode query request
            var request = {
                targets: targets,
                chaincodeId: config.chaincodeID,
                chainId: config.channelID,
                txId: utils.buildTransactionID(),
                nonce: utils.getNonce(),
                fcn: config.queryRequest.functionName,
                args: args
            };
            // Query chaincode
            return chain.queryByChaincode(request);
        }
    ).then(
        function(response_payloads) {
            for (let i = 0; i < response_payloads.length; i++) {
                logger.info('############### Query results after the move on PEER%j, User "b" now has  %j', i, response_payloads[i].toString('utf8'));
            }
        }
    ).catch(
        function(err) {
            logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
        }
    );

  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}


exports.assetImagePOST = function(args, res, next) {
  /**
   * Upload or change `assetImage` 
   *
   * body File the image
   * returns assetImage
   **/


  var assetID = parseInt(args.asset_id.value);

  //ToDo save file
  var fileName = "ben.jpg";
  var fileLocation = "/home/file/";

    db.any('insert into asset_images(asset_id, image_url)' +
        'values($1, $2)', [assetID, fileLocation])
            .then(function (data) {
                //ToDo should this method return anything?

                res.setHeader('Content-Type', 'application/json');
                //ToDo set responce status code to 201
                res.end(JSON.stringify(data[Object.keys(data)[0]] || {}, null, 2));
            })
            .catch(function (err) {
                return next(err);
            });
}

exports.assetsAllStatesGET = function(args, res, next) {
  /**
   * Get all available states 
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ "aeiou" ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.assetsOwnerOwner_idGET = function(args, res, next) {
  /**
   * Gets all `Asset` for asset owner. 
   *
   * owner_id String the owner unique id
   * returns List
   **/
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
}

exports.assetsUserUser_idGET = function(args, res, next) {
  /**
   * Gets all `Asset` for asset owner. 
   *
   * user_id String the user unique id
   * returns List
   **/
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
}

exports.eventEvent_idGET = function(args, res, next) {
  /**
   * Get a signle `event` by event id 
   *
   * event_id String the event id
   * returns event
   **/
  var examples = {};
  examples['application/json'] = {
  "eventInfo" : "{}",
  "created_at" : "aeiou",
  "id" : "aeiou",
  "eventType" : "aeiou",
  "asset_id" : "aeiou",
  "person_id" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.eventPOST = function(args, res, next) {
  /**
   * Post an `asset` `event` 
   *
   * body Event the event object
   * returns event
   **/
  var examples = {};
  examples['application/json'] = {
  "eventInfo" : "{}",
  "created_at" : "aeiou",
  "id" : "aeiou",
  "eventType" : "aeiou",
  "asset_id" : "aeiou",
  "person_id" : "aeiou"
};


    var tx_id = null;

    console.log("in eventPOST");
    hfc.newDefaultKeyValueStore({
        path: config.keyValueStore
    }).then(function(store) {
        client.setStateStore(store);
        return helper.getSubmitter(client);
    }).then(
        function(admin) {
            logger.info('Successfully obtained user to submit transaction');

            logger.info('Executing Invoke');
            tx_id = helper.getTxId();
            var nonce = utils.getNonce();
            var args = helper.getArgs(config.invokeRequest.args);
            // send proposal to endorser
            var request = {
                chaincodeId: config.chaincodeID,
                fcn: config.invokeRequest.functionName,
                args: args,
                chainId: config.channelID,
                txId: tx_id,
                nonce: nonce
            };
            return chain.sendTransactionProposal(request);
        }
    ).then(
        function(results) {
            logger.info('Successfully obtained proposal responses from endorsers');

            return helper.processProposal(chain, results, 'move');
        }
    ).then(
        function(response) {
            if (response.status === 'SUCCESS') {
                var handle = setTimeout(() => {
                        logger.error('Failed to receive transaction notification within the timeout period');
                process.exit(1);
            }, parseInt(config.waitTime));

                eventhub.registerTxEvent(tx_id.toString(), (tx) => {
                    logger.info('The chaincode transaction has been successfully committed');
                clearTimeout(handle);
                eventhub.disconnect();
            });
            }
        }
    ).catch(
        function(err) {
            eventhub.disconnect();
            logger.error('Failed to invoke transaction due to error: ' + err.stack ? err.stack : err);
        }
    );



    if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.eventsAllAvailableEventsGET = function(args, res, next) {
  /**
   * Get a signle `event` by event id 
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ "aeiou" ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.eventsPerson_idGET = function(args, res, next) {
  /**
   * Get all `asset` for a specific person 
   *
   * person_id String the person id
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "eventInfo" : "{}",
  "created_at" : "aeiou",
  "id" : "aeiou",
  "eventType" : "aeiou",
  "asset_id" : "aeiou",
  "person_id" : "aeiou"
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.personPerson_idGET = function(args, res, next) {
  /**
   * Gets the `person` by person id 
   *
   * person_id String the user unique id
   * returns person
   **/
  var examples = {};
  examples['application/json'] = {
  "firstName" : "aeiou",
  "lastName" : "aeiou",
  "companyName" : "aeiou",
  "created_at" : "aeiou",
  "id" : "aeiou",
  "userName" : "aeiou",
  "email" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.usersOwner_idGET = function(args, res, next) {
  /**
   * Gets all `user` by the owner id. 
   *
   * owner_id String the owner unique id
   * returns List
   **/
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
}


exports.usersOwner_idPOST = function(args, res, next) {
    /**
     * Create a new user.
     *
     * owner_id String the owner unique id
     * returns List
     **/

    //logger.error(util.inspect(args, false, null));

    var examples = {};
    examples['application/json'] = [ {
        "firstName" : args.body.value.firstName,
        "lastName" : args.body.value.lastName,
        "companyName" : args.body.value.companyName,
        "created_at" : "aeiou",
        "id" : "aeiou",
        "userName" : args.body.value.userName,
        "email" : args.body.value.email
    } ];


    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
}


exports.assetCreatePOST = function(args, res, next) {
    /**
     * Create a single `Asset`
     *
     * body Asset asset object to be added to the database
     * returns asset
     **/
    var examples = {};
    examples['application/json'] = {
        "user_id" : "aeiou",
        "owner_id" : "aeiou",
        "assetName" : "aeiou",
        "created_at" : "aeiou",
        "description" : "aeiou",
        "id" : "aeiou"
    };

    var tx_id = null;

    hfc.newDefaultKeyValueStore({
        path: config.keyValueStore
    }).then(function(store) {
        client.setStateStore(store);
        return helper.getSubmitter(client);
    }).then(
        function(admin) {
            logger.info('Successfully obtained enrolled user to deploy the chaincode');

            logger.info('Executing Deploy');
            tx_id = helper.getTxId();
            var nonce = utils.getNonce();
            var args = helper.getArgs(config.deployRequest.args);
            // send proposal to endorser
            var request = {
                chaincodePath: config.chaincodePath,
                chaincodeId: config.chaincodeID,
                fcn: config.deployRequest.functionName,
                args: args,
                chainId: config.channelID,
                txId: tx_id,
                nonce: nonce,
                'dockerfile-contents': config.dockerfile_contents
            };
            return chain.sendDeploymentProposal(request);
        }
    ).then(
        function(results) {
            logger.info('Successfully obtained proposal responses from endorsers');
            return helper.processProposal(chain, results, 'deploy');
        }
    ).then(
        function(response) {
            if (response.status === 'SUCCESS') {
                logger.info('Successfully sent deployment transaction to the orderer.');
                var handle = setTimeout(() => {
                        logger.error('Failed to receive transaction notification within the timeout period');
                process.exit(1);
            }, parseInt(config.waitTime));

                eventhub.registerTxEvent(tx_id.toString(), (tx) => {
                    logger.info('The chaincode transaction has been successfully committed');
                clearTimeout(handle);
                eventhub.disconnect();
            });
            } else {
                logger.error('Failed to order the deployment endorsement. Error code: ' + response.status);
            }
        }
    ).catch(
        function(err) {
            eventhub.disconnect();
            logger.error(err.stack ? err.stack : err);
        }
    );

    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
}
