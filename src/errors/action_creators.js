export const RAISE_ERROR = 'RAISE_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';

export function raiseError(msg) {
  return {
    type: RAISE_ERROR,
    msg,
  };
}

export function hideError() {
  return {
    type: HIDE_ERROR,
  };
}
