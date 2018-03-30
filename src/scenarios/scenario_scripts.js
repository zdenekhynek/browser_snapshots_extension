import { fromJS } from 'immutable';

import { navigateToUrl, clearCache } from '../utils/extension_utils';

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

export const CLEAR_CACHE_SCRIPT = 'CLEAR_CACHE_SCRIPT';

export function clearCacheScript() {
  return {
    fn: clearCache,
    args: [],
  };
}

export const GO_ON_YOUTUBE_SCRIPT = 'GO_ON_YOUTUBE_SCRIPT';

export function goOnYotubeScript() {
  return {
    fn: navigateToUrl,
    args: ['https://www.youtube.com'],
  };
}

export const SEARCH_YOUTUBE = 'SEARCH_YOUTUBE';

export function fillYoutubeSearchBox(input) {
  let script = 'document.querySelector("ytd-searchbox #search-input input")';
  script += `.value="${input}";`;
  return script;
}

export function confirmYoutubeSearch() {
  let script = 'document.querySelector("ytd-searchbox #search-form")';
  script += '.submit();';
  return script;
}

export function searchYoutube(input) {
  const fillScript = fillYoutubeSearchBox(input);
  const confirmScript = confirmYoutubeSearch();
  return fillScript + confirmScript;
}

export const CLICK_SEARCH_RESULT = 'CLICK_SEARCH_RESULT';

export function clickSearchResult(index) {
  let script = 'document.querySelectorAll("ytd-search ytd-video-renderer a")';
  script += `[${index}]`;
  script += '.click();';
  return script;
}

export const SCRIPTS = {
  [ALERT_SCRIPT]: alertScript,
  [NEXT_VIDEO_SCRIPT]: nextVideoScript,
  [CLICK_SKIP_AD_SCRIPT]: clickSkipAdScript,
  [CLEAR_CACHE_SCRIPT]: clearCacheScript,
  [GO_ON_YOUTUBE_SCRIPT]: goOnYotubeScript,
  [SEARCH_YOUTUBE]: searchYoutube,
  [CLICK_SEARCH_RESULT]: clickSearchResult,
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
