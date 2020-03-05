import R from 'ramda';
import pullMessages from './pubsub/pullMessages';
import ackMessages from './pubsub/ackMessages';

/**
 * @typedef Message
 * @type {object}
 * @property {string} data
 * @property {object} attributes
 * @property {string} messageId
 * @property {string} publishTime
 */

/**
 * @typedef ReceivedMessage
 * @type {object}
 * @property {string} ackId
 * @property {Message} message
 */

/**
 * Convert message to rowContent
 * @param {Message} message
 */
const messageToRowContent = (message) => {
  const {
    data, attributes, messageId, publishTime
  } = message;

  const {
    type, payload, error, ...rest
  } = data;

  const main = [messageId, new Date(publishTime), JSON.stringify(attributes)];

  if (!type) {
    return [...main, '-', JSON.stringify(data), ''];
  }

  if (error) {
    return [...main, type, error.message, ''];
  }

  return [...main, type, JSON.stringify(payload), JSON.stringify(rest)];
};

function pullMessagesForSheet(sheet) {
  const subscription = `projects/autocrash-erpnext/subscriptions/${sheet.getName()}`;

  const receivedMessages = pullMessages(subscription);

  if (R.isEmpty(receivedMessages)) {
    return 0;
  }

  // Get messages from list
  const messages = receivedMessages.map(R.prop('message'));

  // Convert to spreadsheet values
  const values = messages.map(messageToRowContent);

  // Get range and set values
  const row = sheet.getLastRow() + 1;
  const col = 1;
  const numRows = values.length;
  const numColumns = 6;
  sheet.getRange(row, col, numRows, numColumns).setValues(values);

  // Sort by publishTime
  sheet.sort(2);

  // Ack messages by ackId
  const ackIds = receivedMessages.map(R.prop('ackId'));
  ackMessages(subscription, ackIds);

  return receivedMessages.length;
}

export default pullMessagesForSheet;
