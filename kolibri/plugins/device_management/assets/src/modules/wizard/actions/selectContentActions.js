import client from 'kolibri.client';
import urls from 'kolibri.urls';
import { downloadChannelMetadata } from '../utils';

/**
 * Transitions the import/export wizard to the 'load-channel-metadata' interstitial state
 *
 */
export function loadChannelMetaData(store) {
  let dbPromise;
  const { transferredChannel } = store.state.manageContent.wizard;
  const channelOnDevice = store.getters['manageContent/channelIsInstalled'](transferredChannel.id);

  // Downloading the Content Metadata DB
  if (!channelOnDevice) {
    // Update metadata when no content db has been downloaded
    dbPromise = downloadChannelMetadata(store);
  } else if (!channelOnDevice.available && channelOnDevice.version < transferredChannel.version) {
    // If channel _is_ on the device, but not "available" (i.e. no resources installed yet)
    // _and_ has been updated, then download the metadata
    dbPromise = downloadChannelMetadata(store);
  } else {
    // If already on device, then skip the DB download, and use on-device
    // Channel metadata, since it has root id.
    dbPromise = Promise.resolve(channelOnDevice);
  }

  // Hydrating the store with the Channel Metadata
  return dbPromise
    .then(channel => {
      // The channel objects are not consistent if they come from different workflows.
      // Replacing them here with canonical type from ChannelResource.
      store.commit('manageContent/wizard/SET_TRANSFERRED_CHANNEL', {
        ...channel,
        version: transferredChannel.version,
        public: transferredChannel.public,
      });
    })
    .catch(({ errorType }) => {
      // ignore cancellations
      if (errorType !== 'CHANNEL_TASK_ERROR') {
        store.commit('manageContent/wizard/SET_WIZARD_STATUS', errorType);
      }
    });
}

/**
 * Makes a call to freespace API and places result in the store.
 * If transfer type is LOCALEXPORT, it gets the selected drive's freespace.
 *
 * @param {string} path - Path to the Kolibri data folder.
 * If empty, defaults to server's KOLIBRI_HOME.
 * @returns {Promise}
 *
 */
export function getAvailableSpaceOnDrive(selectedDrive) {
  if (selectedDrive) {
    return Promise.resolve(selectedDrive.freespace);
  }
  return client({
    path: `${urls['kolibri:core:freespace']()}`,
    params: {},
  })
    .then(({ entity }) => entity.freespace)
    .catch(() => -1);
}
