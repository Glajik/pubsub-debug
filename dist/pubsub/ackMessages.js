import R from 'ramda';
import pubsubRequest from './pubsubRequest';

/**
 * Method: projects.subscriptions.acknowledge
 * @see https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/acknowledge?hl=ru
 * @param {string} subscription like `projects/${project}/subscriptions/${subscription}`
 * @param {Array} ackIds
 */
function ackMessages(subscription, ackIds) {
  if (R.empty(ackIds)) {
    return;
  }

  const content = pubsubRequest(
    `${subscription}:acknowledge`,
    { ackIds }
  );

  if (!R.empty(content)) {
    const msg = `Response with error: ${content}`;
    throw new Error(msg);
  }

  console.log('Acknowledge %s messages successfull', ackIds.length);
}

export default ackMessages;
