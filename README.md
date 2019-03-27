# WhatSlack

Work in progress. Once done, WhatSlack will be able to forward WhatsApp conversations to Slack.

## Development setup

This project will run as a Chrome(ium) extension to plug into WhatsApp Web. This is the easiest (only?) way to read decrypted data/messages from WhatsApp and removes the headache of developing a way to get authenticated etc.

```bash
git clone https://github.com/Qrivi/WhatSlack.git
cd WhatSlack
npm run setup
```
... easy as 1, 2, 3!


`npm run setup` will `npm install && npm run build` for each submodule. There's no need to `npm install` in the root since there is no actual project in the root.
You _need_ to build at least once so required extension files are placed in the `build` directory. Once that's out of the way, launch Chrome, enable developer mode on `chrome://extensions`, hit "load unpacked" and choose the build directory.

### Submodules

This extension exists of 3 ~~parts~~ submodules (fancier name): all are node modules placed in the `develop` directory. Their `npm` scripts should be self-explanatory.

### `content`

This is the meat and beans, the script that gets injected into WhatsApp and takes care of forwarding. In the end pretty it's basic JavaScript, transpiled from ES6 so I could have some structure in there.

### `options`

The extension options page. This is where you'll set your Slack bot's API OAuth key, but will also be able to manage your forwarding rules (apart from the small section injected into WhatsApp web UI -- this will be more intuitive), clear cache, etc.

### `popup`

Still needs to be written, but the extension popup will be a centralized place for displaying errors. This is easier, cleaner and less prone to breaking than adding something to change WhatsApp Web's UI.

## Disclaimer

Not affiliated, associated, payed or sued by WhatsApp or Facebook and would like to keep it that way.

Because I can only work on this in my scarce free time, I've set up a kan ban board here in GitHub projects so I can keep track of what to do next. Might be interesting to have a peek if you do want to do some development on this.
