app.service('CampaignService', function () {
  var defaultSearch = {
    'ageRange': '',
    'count': '100',
    'numberOfFollowers': 0,
    'campaignIds': '',
    'startKey': '',
    'tags': '',
    'status': '',
    'userId': '',
    'type': 'pay,trade',
    'filterByTags': ''
  };
  this.apiClient = apigClientFactory.newClient({ 'apiKey': 'G84MftERYj7VP0ACf3uQh3w9ewFbgdi06C1GtA1B' });
  this.getCampaigns = function (filters) {
    return this.apiClient.campaignGet(angular.extend(angular.copy(defaultSearch), filters), {}, { headers: { 'Content-type': 'application/json' } });
  };
  this.patchCampaign = function (campaign) {
    var updatedCampaign = {};
    angular.copy(campaign, updatedCampaign);
    delete updatedCampaign.updateTime;
    delete updatedCampaign.ageGroups;
    delete updatedCampaign.createTime;
    return this.apiClient.campaignPatch({}, updatedCampaign);
  };
});