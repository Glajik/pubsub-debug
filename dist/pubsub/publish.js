/* global Utilities Session ScriptApp: true */

/* eslint-disable camelcase */
import pubsubRequest from './pubsubRequest';
import maybeCached from '../utils/maybeCached';

/**
 * @see https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics/publish?hl=ru
 * @param {string} topic like `projects/${project}/topics/${topic}`
 * @param {Array} messages list of messages
 *
 * @returns {Array} messageIds
 */
function publish(topic, messages) {

  const publisher = JSON.stringify({
    type: 'GOOGLE_APPS_SCRIPT',
    scriptId: maybeCached('ScriptId', () => ScriptApp.getScriptId()),
    endpoint: maybeCached('EndpointUrl', () => ScriptApp.getService().getUrl()),
    email: maybeCached('EffectiveUserEmail', () => Session.getEffectiveUser().getEmail()),
  });

  const attributes = { publisher };

  const composeMessage = (json) => {
    const text = JSON.stringify(json);
    const encoded = Utilities.base64Encode(text, Utilities.Charset.UTF_8);
    return { attributes, data: encoded };
  };

  const content = pubsubRequest(
    `${topic}:publish`,
    { messages: messages.map(composeMessage) }
  );

  const { messageIds } = JSON.parse(content);

  console.log('Publish of %s messages success', messageIds.length);

  return messageIds;
}

export default publish;
