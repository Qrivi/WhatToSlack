chrome.webRequest.onHeadersReceived.addListener(details => {
  console.log('Relaxing Slack API CORS to allow Authorization header');
  // https://twitter.com/Qrivi/status/1109527870098075648

  details.responseHeaders.push({ name: 'Access-Control-Allow-Headers', value: 'slack-route, x-slack-version-ts, Origin, Content-Type, Accept, Authorization' });
  return { responseHeaders: details.responseHeaders };
}, {
  urls: [ 'https://slack.com/api/*' ],
  types: [ 'xmlhttprequest' ]
},
[ 'blocking', 'responseHeaders' ]
);

chrome.runtime.onMessage.addListener((message, sender) => {
  if(sender.id !== chrome.runtime.id)
    return;

  if(message.action === 'OPEN_OPTIONS')
    chrome.runtime.openOptionsPage();
});
