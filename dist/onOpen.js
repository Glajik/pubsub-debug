/* globals SpreadsheetApp : true */
import R from 'ramda';
import pullMessages from './pubsub/pullMessages';
import ackMessages from './pubsub/ackMessages';

// eslint-disable-next-line no-unused-vars
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Pubsub debug')
    .addItem('Pull messages', 'handleMenuItemPullMessages')
    .addToUi();
}

// eslint-disable-next-line no-unused-vars

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

function handleMenuItemPullMessages() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetName = sheet.getSheetName();
  const subscription = `projects/autocrash-erpnext/subscriptions/${sheetName}`;

  // Pull messages
  const receivedMessages = pullMessages(subscription);

  /**
   * Convert message to rowContent
   * @param {Message} message 
   */
  const toRowContent = (message) => {
    const {
      data, attributes, messageId, publishTime
    } = message;

    const {
      type, payload, error, ...rest
    } = data;

    const main = [messageId, new Date(publishTime), attributes];

    if (!type) {
      return [...main, '-', JSON.stringify(data), ''];
    }

    if (error) {
      return [...main, type, error.message, ''];
    }

    return [...main, type, JSON.stringify(payload), JSON.stringify(rest)];
  };

  // Get messages from list
  const messages = receivedMessages.map(R.prop('message'));

  // Convert to spreadsheet values
  const values = messages.map(toRowContent);

  // Get range and set values
  const row = sheet.getLastRow() + 1;
  const col = 1;
  const numRows = values.length;
  const numColumns = 6;
  sheet.getRange(row, col, numRows, numColumns).setValues(values);

  // Ack messages by ackId
  const ackIds = receivedMessages.map(R.prop('ackId'));
  ackMessages(subscription, ackIds);
}
