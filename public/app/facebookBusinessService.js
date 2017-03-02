app.service('FacebookBusinessService', function () {
  this.apiClient = apigClientFactory.newClient({ 'apiKey': 'G84MftERYj7VP0ACf3uQh3w9ewFbgdi06C1GtA1B' });
  this.createProject = function (userId, name) {
    return this.apiClient.socialFacebookBusinessPost({}, {
      'userId': userId,
      'name': name,
      'action': 'createProject'
    }, { headers: { 'Content-type': 'application/json' } });
  };
  this.claimApp = function (campaignId, userId, appId) {
    return this.apiClient.socialFacebookBusinessPost({}, {
      'campaignId': campaignId,
      'userId': userId,
      'appId': appId,
      'action': 'claimApp'
    }, { headers: { 'Content-type': 'application/json' } });
  };
  this.claimPage = function (campaignId, userId, pageId) {
    return this.apiClient.socialFacebookBusinessPost({}, {
      'campaignId': campaignId,
      'userId': userId,
      'pageId': pageId,
      'action': 'claimPage'
    }, { headers: { 'Content-type': 'application/json' } });
  };
  this.validateBusinessId = function (businessId, userId) {
    return this.apiClient.socialFacebookBusinessPost({}, {
      'businessId': businessId,
      'userId': userId,
      'action': 'validateBusinessId'
    }, { headers: { 'Content-type': 'application/json' } });
  };
  this.checkPagePermission = function (campaignId, userId, pageId) {
    return this.apiClient.socialFacebookBusinessPost({}, {
      'campaignId': campaignId,
      'userId': userId,
      'pageId': pageId,
      'action': 'checkPagePermission'
    }, { headers: { 'Content-type': 'application/json' } });
  };
  this.createAdAccount = function (campaignId, userId, name, partnerId) {
    console.log('PartnerId', partnerId);
    if (typeof partnerId === 'undefined' || partnerId === '') {
      partnerId = 'NONE';
    }
    return this.apiClient.socialFacebookBusinessPost({}, {
      'campaignId': campaignId,
      'partnerId': partnerId,
      'userId': userId,
      'adAccountId': '1223002921046165',
      'name': name,
      'action': 'createAdAccount'
    }, { headers: { 'Content-type': 'application/json' } });
  };
});