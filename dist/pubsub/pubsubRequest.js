/* global UrlFetchApp: true */
/* eslint-disable camelcase */
import { getPubSub } from './getPubSub';

/**
 * Perform API request to Pubsub service via REST API
 * @param {string} method like `projects/${project}subscriptions/${subscription}:pull`
 * @param {*} requestBody Object
 *
 * @returns {string} text content
 */
function pubsubRequest(method, requestBody) {
  const url = `https://pubsub.googleapis.com/v1/${method}`;

  const service = getPubSub();

  if (!service.hasAccess()) {
    throw new Error(service.getLastError());
  }

  const params = {
    method: 'POST',
    contentType: 'application/json',
    muteHttpExceptions: true,
    headers: {
      Authorization: ['Bearer ', service.getAccessToken()].join(''),
    },
    payload: JSON.stringify(requestBody),
  };

  const response = UrlFetchApp.fetch(url, params);

  const content = response.getContentText();
  const code = response.getResponseCode();

  if (code !== 200) {
    const msg = `Request error: ${code}. Content: ${content}`;
    throw new Error(msg);
  }

  return content;
}

export default pubsubRequest;
