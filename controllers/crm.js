/**
 * Library to create deal in pipedrive
 * Deal creation sequence:
 * 1. Create organization
 * 2. Create person
 * 3. Create deal
 */

var Pipedrive = require('pipedrive');
var Promise = require('bluebird');
var _ = require('lodash');

var pipedrive = new Pipedrive.Client(process.env.PIPEDRIVE_API_KEY || "51795b7049fc8117fefd6b75544e72872cb8faac");
// Dev Key: 553bb851a3d7ece42e2515f8ee675fa13eee27ef

var STAGE_ENUM = {SIGNEDUP_STAGE: "Signed Up", DEAL_PROPOSED : "Deal Proposed", CAMPAIGN_PROPOSED : "Campaign Proposed", LEADS: "Leads", NEW: "new", READ: "read"};


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.createOrgApi = function(req, res){
    exports.createOrganization(req.body.name).then(function(newOrg){
        return res.send(newOrg);
        }
    ).catch(function(err){
         res.send(err);
     });
};

exports.createPersonDealFilter = function(req, res){
    if(!process.env.PIPEDRIVE_SIGNEDIN_STAGE_ID){
        process.env.PIPEDRIVE_SIGNEDIN_STAGE_ID = 13;
        process.env.PIPEDRIVE_APPROVED_STAGE_ID = 14;
        process.env.PIPEDRIVE_ACTIVE_STAGE_ID = 15;
        process.env.PIPEDRIVE_CELEBRITY_USED_ID = 12495;
    }
    exports.createFilterForDeals(req.body.personId, process.env).then(function(newFilter){
        return res.send(newFilter);
        }
    ).catch(function(err){
        res.send(err);
    });
};


exports.createPersonApi = function(req, res){
    exports.createPerson(req.body.name, req.body.organizationId, req.body.email, "").then(function(newPerson){
        return res.send(newPerson);
        }
    ).catch(function(err){
         res.send(err);
     });
};

exports.createCelebrityApi = function(req, res){
    exports.createDeal(
      req.body.title,
      req.body.value,
      req.body.currency,
      req.body.organizationName ? req.body.organizationName : req.body.personName,
      req.body.personName,
      req.body.customFields,
      req.body.initStageEnum,
      process.env.PIPEDRIVE_CELEBRITY_PIPELINE_ID
    ).then(function(newDeal){
        return res.send(newDeal);
        }
    );
};

exports.createDealApi = function(req, res){
    exports.createDeal(
      req.body.title,
      req.body.value,
      req.body.currency,
      req.body.organizationName ? req.body.organizationName : req.body.personName,
      req.body.personName,
      req.body.customFields,
      req.body.initStageEnum,
      process.env.PIPEDRIVE_PIPELINE_ID
    ).then(function(newDeal){
        return res.send(newDeal);
        }
    );
};

exports.getDealsByFilter = function(req, res){
    exports.findDealsByFilterId(req.params.filterId).then(function(deals){
        return res.send(deals);
        }
    );
};

exports.updateDealApi = function(req, res){
    if(req.body.id){
        console.log(req.body);
        pipedrive.Deals.update(req.body.id, req.body, function (err, response) {
                    console.log(response);
                    console.log(err);
            return res.send(err||"");
        });
    } else {
      reject("Bad Request: id is required.");
    }
}
/**
 * Create (or just return) organization object
 *
 * @param name
 * @returns {*}
 */
exports.createOrganization = function (name) {
    return exports.findOrganization(name)
        .then(function (organization) {
            return new Promise(function (resolve, reject) {
                console.log("found organization:");
                //console.log(organization);
                if (typeof organization === 'undefined' || organization == null) {
                    pipedrive.Organizations.add({"name": name}, function (err, result) {
                        if (err)
                            reject(err);
                        resolve(result);
                    });

                } else {
                    console.log("Organization", name, "already exists");
                    resolve(organization)
                }
            });
        })
        .then(function (organization) {
            // console.log(organization);
            return organization;
        });

};

exports.deleteFilter = function(filterId) {
  return new Promise(function (resolve, reject) {
    pipedrive.Filters.remove(filterId, function(err, result){
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.findDealsByFilterId = function(filterId) {
  return new Promise(function (resolve, reject) {
    if (filterId === undefined || !filterId) {
      reject("Bad Request: filterId is required.");
      return;
    }

    var params = {
      "filter_id" : filterId
    };

    pipedrive.Deals.getAll(params, function(err, results){
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.createFilterForDeals = function(personId, stageVariables) {

  return new Promise(function (resolve, reject) {
    var personIdFieldId = stageVariables.PIPEDRIVE_PERSONID_FIELD_ID;
    var stageIdFieldId = stageVariables.PIPEDRIVE_STAGEID_FIELD_ID;
    var celebrityUsedFieldId = stageVariables.PIPEDRIVE_CELEBRITY_USED_ID;
    var filterId = makeid();

    var data = {
        "name" : filterId,
        "conditions": {
          "glue": "and",
          "conditions":
          [
            {
              "glue": "and",
              "conditions": [
                {
                   "object": "deal",
                   "field_id": stageIdFieldId,
                   "operator": "!=",
                    "value": stageVariables.PIPEDRIVE_SIGNEDIN_STAGE_ID,
                    "extra_value": null
                },
                {
                   "object": "deal",
                   "field_id": stageIdFieldId,
                   "operator": "!=",
                    "value": stageVariables.PIPEDRIVE_APPROVED_STAGE_ID,
                    "extra_value": null
                },
                {
                   "object": "deal",
                   "field_id": stageIdFieldId,
                   "operator": "!=",
                    "value": stageVariables.PIPEDRIVE_ACTIVE_STAGE_ID,
                    "extra_value": null
                }
              ]
            },
            {
              "glue": "or",
              "conditions": [
                {
                   "object": "deal",
                   "field_id": personIdFieldId,
                   "operator": "=",
                    "value": personId,
                    "extra_value": null
                },
                {
                    "object": "deal",
                    "field_id": celebrityUsedFieldId,
                    "operator": "=",
                    "value": personId,
                    "extra_value": null
                }
              ]
            }
          ]
        },
        "type" : "deals"
    };
    console.log("create pipedrive filter:", data);
    pipedrive.Filters.add(data, function(err, result){
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

};

// exports.findDealsByPersonId = function(personId, term) {
//   return new Promise(function (resolve, reject) {
//
//     var params = {
//       person_id : personId,
//       term: term
//     };
//
//     pipedrive.Deals.find(params, function(err, results){
//       if (err) {
//         console.error(err);
//         reject(err);
//       } else {
//
//       }
//     });
//   });
// };

/**
 * Find organization object with "name"
 * returns organization object or null (if not found)
 *
 * Note: Organization not immediately searchable after creation, so this function cannot be used to determine
 * if an organization already exists or not.
 * @param name
 */
exports.findOrganization = function (name) {
    return new Promise(function (resolve, reject) {
        pipedrive.Organizations.find({"term": name}, function (err, result) {
            if (err)
                reject(err);
            if (result.length == 1) {
                resolve(result[0]);
            }
            else if (result.length > 1) {
                resolve(_.find(result, {"name": name}));
            } else
                resolve(null);
        });
    });
};

exports.findPerson = function (name, organizationId) {
    return new Promise(function (resolve, reject) {
        pipedrive.Persons.find(
            {
                "term": name,
                "org_id": organizationId
            }, function (err, result) {
                if (err)
                    reject(err);
                if (result.length == 1) {
                    resolve(result[0]);
                }
                else if (result.length > 1) {
                    resolve(_.find(result, {"name": name}));
                } else
                    resolve(null);
            });
    });
};

exports.createPerson = function (name, organizationId, emails, phones) {
    console.log("=====>", organizationId);
    return exports.findPerson(name, organizationId)
        .then(function (person) {
            return new Promise(function (resolve, reject) {
                if (typeof person === 'undefined' || person == null) {
                    pipedrive.Persons.add(
                        {
                            "name": name,
                            "org_id": organizationId,
                            "email": emails,
                            "phone": phones,
                            "visible_to": 3
                        },
                        function (err, result) {
                            if (err)
                                reject(err);

                            // console.log(result);

                            resolve(result);
                        });

                } else {
                    console.log("Person", name, "already exists");
                    resolve(person)
                }
            });
        })
        .then(function (person) {
            console.log(person);
            return person;
        });

};


exports.deletePerson = function(personId) {
    return new Promise(function (resolve, reject) {
        pipedrive.Persons.remove(personId, function(err, result){
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.deleteOrganization = function(organizationId) {
    return new Promise(function (resolve, reject) {
        pipedrive.Organizations.remove(organizationId, function(err, result){
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.getAllDeals = function() {
  return new Promise(function (resolve, reject) {
    pipedrive.Deals.getAll({}, function(err, deals) {
      if (err) reject(err);
      for (var i = 0; i < deals.length; i++) {
          console.log(deals[i].title + ' (worth ' + deals[i].value + ' ' + deals[i].currency + ')');
      }
      resolve(deals);
    });
  });
};


exports.createDeal = function (title, value, currency, organizationName, personName, customs, initStageEnum, pipelineId) {

    var orgId = null;
    return exports.createOrganization(organizationName)
        .then(function (organization) {
            //console.log(organization);
            orgId = organization.id;
            return exports.createPerson(personName, organization.id, [], []);
        })
        .then(function (person) {
            return new Promise(function (resolve, reject) {
                console.log("getting pipeline stages info. pipelineId :" + pipelineId);
                pipedrive.Stages.getAll({"pipeline_id": pipelineId}, function (err, stages) {
                    if (err)
                        reject(err);

                    var initStage =  initStageEnum?_.find(stages, {"name": STAGE_ENUM[initStageEnum]}): _.find(stages, {"name": STAGE_ENUM.SIGNEDUP_STAGE});
                    console.log(stages);

                    var payload = {
                        "title": title,
                        "value": value,
                        "currency": currency,
                        "stage_id": initStage.id,
                        "person_id": person.id,
                        "org_id": orgId,
                        "status": "OPEN",
                        "visible_to": 3
                    };

                    console.log("create deals payload:");
                    console.log(payload);

                    for (var attrname in customs) {
                      payload[attrname] = customs[attrname];
                    }

                    pipedrive.Deals.add(payload, function (err, deal) {
                        if (err)
                            reject(err);
                        else
                            resolve(deal);
                    });

                });

            });
        });

};

exports.createFeedback = function(req, res){
   pipedrive.Stages.getAll({"pipeline_id": process.env.PIPEDRIVE_FEEDBACK_ID}, function (err, stages) {
       if (err)
           reject(err);

       var initStage =  req.body.initStageEnum?_.find(stages, {"name": STAGE_ENUM[req.body.initStageEnum]}): _.find(stages, {"name": STAGE_ENUM.SIGNEDUP_STAGE});
       console.log(process.env.PIPEDRIVE_FEEDBACK_ID);
       console.log(stages);

       var payload = {
           "title": req.body.title,
           "stage_id": initStage.id,
           "status": "OPEN",
           "visible_to": 3
       };

       console.log("create deals payload:");
       console.log(payload);

       for (var attrname in req.body.customFields) {
         payload[attrname] = req.body.customFields[attrname];
       }

       pipedrive.Deals.add(payload, function (err, deal) {

          return res.send(err||deal);

       });

   });
 };

