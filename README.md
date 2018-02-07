# Browser Snaphost Extension

An extension which takes a screenshot and saves a source code of a page
everytime the URL of the page changes.

The data is stored in a [Django Backend](https://github.com/zdenekhynek/browser_snapshots)
so that it can be reviewed and amended.

## Usage

1. In a Chrome browser, go to `chrome://extensions` and click the `Load unpacked extensions` button.

2. Select the dist folder of this repo.

3. The extension has been added to your browser. Click on the little camera icon
and login with your credentials.

4. After you've logged-in you can start capturing the data by clicking the `Start snapshots`.
The captured snapshots will be listed in the extension popup. You can close the extension popup,
the extension will continue capturing data which is indicated by a little 'record' red icon
next to the camera.

5. To stop capturing the data, click `Stop snaphosts`.

6. If you're logged-in into a google account in the browser where the extension
is running, you should pick that account from the dropdown at the top of the
popup (it's the one with the little android icon next to it).

7. From the script dropdown (the one with a little diagram next to
it), you can select a scripts the extension can follow. There are following
scripts available (there might be more soon):
  - `Let it watch` (default) - doesn't interact with your browser
  - `Next up` - clicks the yt Next Up video about every 30-40 seconds.
  - `Let it watch, next up` - clicks the yt Next Up video about every 5-7 minutes


## Development

If you wanted to work on the extension itself, follow these steps.

### Requirements

- `node` v8.2.x
- `npm` v5.3.

You'll also need to be running the Django backend as described in the
[browser extension](https://github.com/zdenekhynek/browser_snapshots) repo.

### Installation on Mac OS X

```shell
npm i
```

### Run development build

```shell
npm run watch
```

### Compile production build

```shell
npm run build:production
```

### Change the backend storage

To change the URL where the extension is sending data, change the [`API_URL`](webpack.production.config.js#L87)
in the [production webpack config]((webpack.production.config.js#L87).

