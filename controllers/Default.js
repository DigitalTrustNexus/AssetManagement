'use strict';

var url = require('url');

var Default = require('./DefaultService');


module.exports.assetAsset_idGET = function assetAsset_idGET (req, res, next) {
  Default.assetAsset_idGET(req.swagger.params, res, next);
};

module.exports.assetAsset_idImageGET = function assetAsset_idImageGET (req, res, next) {
  Default.assetAsset_idImageGET(req.swagger.params, res, next);
};

module.exports.assetAsset_idStateGET = function assetAsset_idStateGET (req, res, next) {
  Default.assetAsset_idStateGET(req.swagger.params, res, next);
};

module.exports.assetCreatePOST = function assetCreatePOST (req, res, next) {
  Default.assetCreatePOST(req.swagger.params, res, next);
};

module.exports.assetImagePOST = function assetImagePOST (req, res, next) {
  Default.assetImagePOST(req.swagger.params, res, next);
};

module.exports.assetsAllStatesGET = function assetsAllStatesGET (req, res, next) {
  Default.assetsAllStatesGET(req.swagger.params, res, next);
};

module.exports.assetsOwnerOwner_idGET = function assetsOwnerOwner_idGET (req, res, next) {
  Default.assetsOwnerOwner_idGET(req.swagger.params, res, next);
};

module.exports.assetsUserUser_idGET = function assetsUserUser_idGET (req, res, next) {
  Default.assetsUserUser_idGET(req.swagger.params, res, next);
};

module.exports.eventEvent_idGET = function eventEvent_idGET (req, res, next) {
  Default.eventEvent_idGET(req.swagger.params, res, next);
};

module.exports.eventPOST = function eventPOST (req, res, next) {
  Default.eventPOST(req.swagger.params, res, next);
};

module.exports.eventsAllAvailableEventsGET = function eventsAllAvailableEventsGET (req, res, next) {
  Default.eventsAllAvailableEventsGET(req.swagger.params, res, next);
};

module.exports.eventsPerson_idGET = function eventsPerson_idGET (req, res, next) {
  Default.eventsPerson_idGET(req.swagger.params, res, next);
};

module.exports.personPerson_idGET = function personPerson_idGET (req, res, next) {
  Default.personPerson_idGET(req.swagger.params, res, next);
};

module.exports.usersOwner_idGET = function usersOwner_idGET (req, res, next) {
  Default.usersOwner_idGET(req.swagger.params, res, next);
};

module.exports.usersOwner_idPOST = function usersOwner_idPOST (req, res, next) {
    Default.usersOwner_idPOST(req.swagger.params, res, next);
};
