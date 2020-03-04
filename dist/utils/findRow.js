import R from 'ramda';

/**
 * Search row number by orderId
 * Этот способ поиска оказался самым быстрым
 * @param {number} orderId
 * @param {Sheet} sheet
 */
function findRow(orderId, sheet) {
  const values = sheet.getRange('D:D').getValues().map(R.head);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < values.length; i++) {
    // eslint-disable-next-line eqeqeq
    if (values[i] == orderId) {
      return i + 1;
    }
  }
  return null;
}

export default findRow;
