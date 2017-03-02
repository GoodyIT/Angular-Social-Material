/*
 * Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var apigClientFactory = {};
apigClientFactory.newClient = function (config) {
    var apigClient = { };
    if(config === undefined) {
        config = {
            accessKey: '',
            secretKey: '',
            sessionToken: '',
            region: '',
            apiKey: undefined,
            defaultContentType: 'application/json',
            defaultAcceptType: 'application/json'
        };
    }
    if(config.accessKey === undefined) {
        config.accessKey = '';
    }
    if(config.secretKey === undefined) {
        config.secretKey = '';
    }
    if(config.apiKey === undefined) {
        config.apiKey = '';
    }
    if(config.sessionToken === undefined) {
        config.sessionToken = '';
    }
    if(config.region === undefined) {
        config.region = 'us-east-1';
    }
    //If defaultContentType is not defined then default to application/json
    if(config.defaultContentType === undefined) {
        config.defaultContentType = 'application/json';
    }
    //If defaultAcceptType is not defined then default to application/json
    if(config.defaultAcceptType === undefined) {
        config.defaultAcceptType = 'application/json';
    }

    
    // extract endpoint and path from url
    var invokeUrl = config.invokeUrl || 'https://api.famepick.com/dev';
    var endpoint = /(^https?:\/\/[^\/]+)/g.exec(invokeUrl)[1];
    var pathComponent = invokeUrl.substring(endpoint.length);

    var sigV4ClientConfig = {
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        sessionToken: config.sessionToken,
        serviceName: 'execute-api',
        region: config.region,
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var authType = 'NONE';
    if (sigV4ClientConfig.accessKey !== undefined && sigV4ClientConfig.accessKey !== '' && sigV4ClientConfig.secretKey !== undefined && sigV4ClientConfig.secretKey !== '') {
        authType = 'AWS_IAM';
    }

    var simpleHttpClientConfig = {
        endpoint: endpoint,
        defaultContentType: config.defaultContentType,
        defaultAcceptType: config.defaultAcceptType
    };

    var apiGatewayClient = apiGateway.core.apiGatewayClientFactory.newClient(simpleHttpClientConfig, sigV4ClientConfig);
    
    
    
    apigClient.adjustGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['timestamp', 'amount', 'transactionId', 'source', 'idfa'], ['body']);
        
        var adjustGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/adjust').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['timestamp', 'amount', 'transactionId', 'source', 'idfa']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(adjustGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.adjustOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var adjustOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/adjust').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(adjustOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.applicationGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userId', 'count', 'startKey', 'type', 'status', 'ownerUserId', 'campaignId', 'applicationId'], ['body']);
        
        var applicationGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/application').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userId', 'count', 'startKey', 'type', 'status', 'ownerUserId', 'campaignId', 'applicationId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(applicationGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.applicationPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var applicationPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/application').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(applicationPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.applicationPatch = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var applicationPatchRequest = {
            verb: 'patch'.toUpperCase(),
            path: pathComponent + uritemplate('/application').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(applicationPatchRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.applicationOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var applicationOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/application').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(applicationOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.appsflyerGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['timestamp', 'amount', 'transactionId', 'source', 'idfa'], ['body']);
        
        var appsflyerGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/appsflyer').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['timestamp', 'amount', 'transactionId', 'source', 'idfa']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(appsflyerGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.appsflyerOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var appsflyerOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/appsflyer').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(appsflyerOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.campaignGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['numberOfFollowers', 'userId', 'campaignIds', 'count', 'ageRange', 'startKey', 'tags', 'status', 'filterByTags'], ['body']);
        
        var campaignGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/campaign').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['numberOfFollowers', 'userId', 'campaignIds', 'count', 'ageRange', 'startKey', 'tags', 'status', 'filterByTags']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(campaignGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.campaignPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var campaignPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/campaign').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(campaignPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.campaignPatch = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var campaignPatchRequest = {
            verb: 'patch'.toUpperCase(),
            path: pathComponent + uritemplate('/campaign').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(campaignPatchRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.campaignOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var campaignOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/campaign').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(campaignOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.clickGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);
        
        var clickGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/click').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['id']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(clickGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.clickOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var clickOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/click').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(clickOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['postId', 'insightsName', 'accessToken', 'ownerId', 'pageId'], ['body']);
        
        var facebookGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['postId', 'insightsName', 'accessToken', 'ownerId', 'pageId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var facebookOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPageInsightGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['accessToken', 'postCount', 'pageId'], ['body']);
        
        var facebookPageInsightGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/page/insight').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['accessToken', 'postCount', 'pageId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPageInsightGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPageInsightOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var facebookPageInsightOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/page/insight').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPageInsightOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPagesGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userId'], ['body']);
        
        var facebookPagesGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/pages').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPagesGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPagesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var facebookPagesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/pages').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPagesOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPostInsightGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['postId'], ['body']);
        
        var facebookPostInsightGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/post/insight').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['postId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPostInsightGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPostInsightOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var facebookPostInsightOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/post/insight').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPostInsightOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPostInsightsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var facebookPostInsightsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/post/insights').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPostInsightsPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookPostInsightsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var facebookPostInsightsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/post/insights').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookPostInsightsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookSearchGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['q'], ['body']);
        
        var facebookSearchGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/search').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['q']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookSearchGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.facebookSearchOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var facebookSearchOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/facebook/search').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(facebookSearchOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.instagramGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['accessToken', 'instagramId'], ['body']);
        
        var instagramGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/instagram').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['accessToken', 'instagramId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(instagramGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.instagramOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var instagramOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/instagram').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(instagramOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.loginPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var loginPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/login').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(loginPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.loginOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var loginOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/login').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(loginOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.matchingGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userId', 'dealId'], ['body']);
        
        var matchingGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/matching').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userId', 'dealId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(matchingGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.matchingOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var matchingOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/matching').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(matchingOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.pagesGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['accessToken'], ['body']);
        
        var pagesGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/pages').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['accessToken']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(pagesGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.pagesOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var pagesOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/pages').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(pagesOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.passwordChangePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var passwordChangePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/password/change').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(passwordChangePostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.passwordChangeOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var passwordChangeOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/password/change').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(passwordChangeOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.passwordLostPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var passwordLostPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/password/lost').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(passwordLostPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.passwordLostOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var passwordLostOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/password/lost').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(passwordLostOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.paymentStripePost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var paymentStripePostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/payment/stripe').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(paymentStripePostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.paymentStripeOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var paymentStripeOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/payment/stripe').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(paymentStripeOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.pipedriveNotificationPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var pipedriveNotificationPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/pipedrive/notification').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(pipedriveNotificationPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.pipedriveNotificationOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var pipedriveNotificationOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/pipedrive/notification').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(pipedriveNotificationOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.redirectGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['id', 'fingerprint'], ['body']);
        
        var redirectGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/redirect').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['id', 'fingerprint']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(redirectGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.redirectOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var redirectOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/redirect').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(redirectOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.schedulepostPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var schedulepostPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/schedulepost').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(schedulepostPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.schedulepostOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var schedulepostOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/schedulepost').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(schedulepostOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookAccountPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookAccountPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/account').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookAccountPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookAccountOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookAccountOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/account').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookAccountOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookAdsPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var socialFacebookAdsPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/ads').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookAdsPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookAdsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookAdsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/ads').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookAdsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookBusinessPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['body'], ['body']);
        
        var socialFacebookBusinessPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/business').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookBusinessPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookBusinessOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookBusinessOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/business').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookBusinessOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookDisableLinkGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['postId', 'accessToken'], ['body']);
        
        var socialFacebookDisableLinkGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/disableLink').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['postId', 'accessToken']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookDisableLinkGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookDisableLinkOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookDisableLinkOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/disableLink').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookDisableLinkOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookFansGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['postId', 'accessToken', 'sendSNSToSaveData', 'pageId'], ['body']);
        
        var socialFacebookFansGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/fans').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['postId', 'accessToken', 'sendSNSToSaveData', 'pageId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookFansGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookFansOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookFansOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/fans').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookFansOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookPagerequestPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookPagerequestPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/pagerequest').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookPagerequestPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookPagerequestOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookPagerequestOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/pagerequest').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookPagerequestOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookUpdateAudienceGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['accessToken', 'userId'], ['body']);
        
        var socialFacebookUpdateAudienceGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/updateAudience').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['accessToken', 'userId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookUpdateAudienceGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialFacebookUpdateAudienceOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialFacebookUpdateAudienceOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/facebook/updateAudience').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialFacebookUpdateAudienceOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialTwitterAudienceGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userId'], ['body']);
        
        var socialTwitterAudienceGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/social/twitter/audience').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialTwitterAudienceGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialTwitterAudienceOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialTwitterAudienceOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/twitter/audience').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialTwitterAudienceOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialYoutubeAudienceGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['accessToken', 'channelId', 'refreshToken', 'videoId', 'days'], ['body']);
        
        var socialYoutubeAudienceGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/social/youtube/audience').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['accessToken', 'channelId', 'refreshToken', 'videoId', 'days']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialYoutubeAudienceGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialYoutubeAudienceOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialYoutubeAudienceOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/youtube/audience').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialYoutubeAudienceOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialYoutubeChannelGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['accessToken', 'refreshToken'], ['body']);
        
        var socialYoutubeChannelGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/social/youtube/channel').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['accessToken', 'refreshToken']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialYoutubeChannelGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialYoutubeChannelOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialYoutubeChannelOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/youtube/channel').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialYoutubeChannelOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialYoutubeDetailsGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['accessToken', 'refreshToken'], ['body']);
        
        var socialYoutubeDetailsGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/social/youtube/details').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['accessToken', 'refreshToken']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialYoutubeDetailsGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.socialYoutubeDetailsOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var socialYoutubeDetailsOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/social/youtube/details').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(socialYoutubeDetailsOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tuneGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['timestamp', 'amount', 'transactionId', 'source', 'idfa'], ['body']);
        
        var tuneGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/tune').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['timestamp', 'amount', 'transactionId', 'source', 'idfa']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tuneGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tuneOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var tuneOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/tune').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tuneOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tweetGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['tweetId'], ['body']);
        
        var tweetGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/tweet').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['tweetId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tweetGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.tweetOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var tweetOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/tweet').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(tweetOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.twitterGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['userId'], ['body']);
        
        var twitterGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/twitter').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['userId']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(twitterGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.twitterOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var twitterOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/twitter').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(twitterOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['owner', 'facebook', 'email', 'demographics', 'id', 'secret'], ['body']);
        
        var userGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['owner', 'facebook', 'email', 'demographics', 'id', 'secret']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var userPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userPatch = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var userPatchRequest = {
            verb: 'patch'.toUpperCase(),
            path: pathComponent + uritemplate('/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userPatchRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.userOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var userOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/user').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(userOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['numberOfFollowers', 'userId', 'likes', 'count', 'startKey', 'returnAllFields', 'ids', 'all'], ['body']);
        
        var usersGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/users').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['numberOfFollowers', 'userId', 'likes', 'count', 'startKey', 'returnAllFields', 'ids', 'all']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersPost = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['all', 'ids'], ['body']);
        
        var usersPostRequest = {
            verb: 'post'.toUpperCase(),
            path: pathComponent + uritemplate('/users').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['all', 'ids']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersPostRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/users').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersOptionsRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersSocialGet = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, ['numberOfFollowers', 'noUserId', 'likes', 'ageRange'], ['body']);
        
        var usersSocialGetRequest = {
            verb: 'get'.toUpperCase(),
            path: pathComponent + uritemplate('/users/social').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, ['numberOfFollowers', 'noUserId', 'likes', 'ageRange']),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersSocialGetRequest, authType, additionalParams, config.apiKey);
    };
    
    
    apigClient.usersSocialOptions = function (params, body, additionalParams) {
        if(additionalParams === undefined) { additionalParams = {}; }
        
        apiGateway.core.utils.assertParametersDefined(params, [], ['body']);
        
        var usersSocialOptionsRequest = {
            verb: 'options'.toUpperCase(),
            path: pathComponent + uritemplate('/users/social').expand(apiGateway.core.utils.parseParametersToObject(params, [])),
            headers: apiGateway.core.utils.parseParametersToObject(params, []),
            queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
            body: body
        };
        
        
        return apiGatewayClient.makeRequest(usersSocialOptionsRequest, authType, additionalParams, config.apiKey);
    };
    

    return apigClient;
};
