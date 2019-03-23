chrome.runtime.onMessage.addListener((message, sender) => {
  if(sender.id !== chrome.runtime.id)
    return;

  if(message.action === 'OPEN_OPTIONS')
    chrome.runtime.openOptionsPage();
});
