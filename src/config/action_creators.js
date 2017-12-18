export const SET_SNAPSHOT_INTERVAL = 'SET_SNAPSHOT_INTERVAL';

export function setSnapshotInterval(interval) {
  return {
    type: SET_SNAPSHOT_INTERVAL,
    interval,
  }
}
