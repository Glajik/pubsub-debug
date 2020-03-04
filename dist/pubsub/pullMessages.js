/* global Utilities : true */
/* eslint-disable camelcase */
import pubsubRequest from './pubsubRequest';


/**
 * Method: projects.subscriptions.pull
 * @see https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/pull?hl=ru
 * @param {string} subscription like `projects/${project}/subscriptions/${subscription}`
 * @returns receivedMessages
 *
 * @request
 * ```JS
 * {
 *   "returnImmediately": boolean, // deprecated
 *   "maxMessages": integer
 * }
 * ```
 * @response
 * ```JS
 * {
 *   "receivedMessages": [
 *     {
 *       "ackId": string,
 *       "message": {
 *          "data": string,
 *          "attributes": {
 *            string: string,
 *            ...
 *          },
 *          "messageId": string,
 *          "publishTime": string
 *       }
 *     }
 *   ]
 * }
 * ```
 */
function pullMessages(subscription) {
  const content = pubsubRequest(
    `${subscription}:pull`,
    { maxMessages: 100 }
  );

  const { receivedMessages } = JSON.parse(content);

  const decode = (message) => {
    const buffer = Utilities.base64Decode(message.data, Utilities.Charset.UTF_8);
    const data = Utilities.newBlob(buffer).getDataAsString();
    return { ...message, data };
  };

  console.log('Pull %s messages successfull', receivedMessages.length);

  return receivedMessages.map(
    ({ ackId, message }) => ({ ackId, message: decode(message) })
  );
}

export default pullMessages;
