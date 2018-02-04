import { fromJS } from 'immutable';

export const ALERT_SCRIPT = 'ALERT_SCRIPT';

export function alertScript(alert = 'Extension alert') {
  return `alert(${alert});`;
}

export const NEXT_VIDEO_SCRIPT = 'NEXT_VIDEO_SCRIPT';

export function nextVideoScript() {
  let selector = 'document.querySelector("ytd-compact-autoplay-renderer")';
  selector += '.querySelector("ytd-compact-video-renderer")';
  selector += '.querySelector("a")';
  const click = '.click()';

  return selector + click;
}

export const CLICK_SKIP_AD_SCRIPT = 'CLICK_SKIP_AD_SCRIPT';

export function clickSkipAdScript() {
  return '';
}

export const SCRIPTS = {
  [ALERT_SCRIPT]: alertScript,
  [NEXT_VIDEO_SCRIPT]: nextVideoScript,
  [CLICK_SKIP_AD_SCRIPT]: clickSkipAdScript,
};


export function noOpScript() {
  return '';
}

export function getScriptById(id, args = []) {
  const scripts = fromJS(SCRIPTS);
  const script = scripts.get(id, noOpScript);

  // call script with arguments
  return script(...args);
}
