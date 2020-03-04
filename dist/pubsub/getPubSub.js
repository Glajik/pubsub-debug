/* global PropertiesService OAuth2 CacheService LockService Session : true */

import getCredentials from '../lib/getCredentials';

/**
 * Configures the service.
 */
export function getPubSub() {
  // eslint-disable-next-line camelcase
  const { private_key, client_email } = getCredentials('PUBSUB_SERVICE_ACCOUNT');

  const userEmail = Session.getEffectiveUser().getEmail();

  return OAuth2.createService(`PubSub:${userEmail}`)
    // Set the endpoint URL.
    .setTokenUrl('https://oauth2.googleapis.com/token')

    // Set the private key and issuer.
    .setPrivateKey(private_key)
    .setIssuer(client_email)

    // Set the property store where authorized tokens should be persisted.
    .setPropertyStore(PropertiesService.getScriptProperties())

    // Scripts that use the library heavily should enable caching on the service,
    // so as to not exhaust their PropertiesService quotas.
    .setCache(CacheService.getUserCache())

    // A race condition can occur when two or more script executions
    // are both trying to refresh an expired token at the same time.
    .setLock(LockService.getUserLock())

    // Set the scopes to request (space-separated for Google services).
    .setScope('https://www.googleapis.com/auth/pubsub https://www.googleapis.com/auth/cloud-platform')

    // Below are Google-specific OAuth2 parameters.
    // Sets the login hint, which will prevent the account chooser screen
    // from being shown to users logged in with multiple accounts.
    .setParam('login_hint', userEmail);
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
export function resetPubSub() {
  getPubSub().reset();
}
