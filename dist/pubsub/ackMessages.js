import R from 'ramda';
import pubsubRequest from './pubsubRequest';

/**
 * Method: projects.subscriptions.acknowledge
 * @see https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/acknowledge?hl=ru
 * @param {string} subscription like `projects/${project}/subscriptions/${subscription}`
 * @param {Array} ackIds
 */
function ackMessages(subscription, ackIds) {
  if (R.isEmpty(ackIds)) {
    return;
  }

  const content = pubsubRequest(
    `${subscription}:acknowledge`,
    { ackIds }
  );

  const data = JSON.parse(content);

  if (!R.isEmpty(data)) {
    const msg = `ackMessages response error: ${content}`;
    throw new Error(msg);
  }

  console.log('Acknowledge %s messages successfull', ackIds.length);
}

export default ackMessages;
