/* global PropertiesService CacheService : true */
import maybeCached from '../utils/maybeCached';

function getCredentials(propName) {
  const credentials = maybeCached(
    propName,
    () => PropertiesService.getScriptProperties().getProperty(propName)
  );

  // eslint-disable-next-line camelcase
  return JSON.parse(credentials);
}

/**
 * Writes credentials of service account to Script Properties.
 * Use carefully, and remember - do it only online script editor,
 * and avoid store your credentials into codebase.
 */
export function setCredentials() {
  const propName = 'SOME_SERVICE_ACCOUNT';

  const credentials = JSON.stringify({
    // Paste your service account here
    type: 'service_account',
    project_id: 'your-project-id',
    private_key_id: '1234567890asdfghjklzxcvbnmqwertyuiop1234',
    private_key: '-----BEGIN PRIVATE KEY-----\n< YOUR PRIVATE KEY >\n-----END PRIVATE KEY-----\n',
    client_email: 'someservice@domain.iam.gserviceaccount.com',
    client_id: '123456789012345678901',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/someservice@domain.iam.gserviceaccount.com',
  });

  PropertiesService.getScriptProperties().setProperty(propName, credentials);
}


export function resetCache(propName) {
  CacheService.getScriptCache().remove(propName);
}

export default getCredentials;
