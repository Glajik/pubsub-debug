/* globals SpreadsheetApp ScriptApp : true */
import pullMessagesForSheet from './pullMessagesForSheet';

// eslint-disable-next-line no-unused-vars
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Pubsub debug')
    .addItem('Pull messages', 'handleMenuItemPullMessages')
    .addToUi();
}

function byTimeTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const results = sheets.map(pullMessagesForSheet);

  // Remove trigger if no messages received for every sheet
  if (results.every(count => count === 0)) {
    ScriptApp.getProjectTriggers().forEach(
      trigger => ScriptApp.deleteTrigger(trigger)
    );
  }
}

// eslint-disable-next-line no-unused-vars
function handleMenuItemPullMessages() {
  byTimeTrigger();

  ScriptApp.newTrigger('byTimeTrigger')
    .timeBased()
    .everyMinutes(1)
    .create();
}
