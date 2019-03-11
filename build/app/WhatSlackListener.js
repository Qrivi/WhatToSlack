class WhatSlackListener {
    constructor( loaderData ) {
        this.forwards = loaderData.forwards ? loaderData.forwards : [];
        this.chats = loaderData.chats ? loaderData.chats : [];
        this.channels = loaderData.channels ? loaderData.channels : [];
        this.contacts = loaderData.contacts ? loaderData.contacts : [];
    }

    start() {
        console.info( '[WhatSlackListener]   start' );
        if( this.LISTENER_TOKEN )
            clearInterval( this.LISTENER_TOKEN );
        // JavaScript this is the best this
        this.LISTENER_TOKEN = setInterval( ( ( self ) => () => self.ping() )( this ), 10 );
        // Don't @ me
    }

    ping() {
        if( window.Store && this.forwards.length !== 0 )
            Store.Msg.models.forEach( model => {
                if( model.isNewMsg ) {
                    model.isNewMsg = false;

                    if( this.forwards.find( f => f.chatId === model.chat.id.user ) ) {
                        window.postMessage( {
                            action: 'HANDLE_EVENT',
                            content: this.cleanModel( model )
                        } );
                    }
                }
            } );
    }

    cleanModel( model ) {
        let event = { type: 'unknown' };
        console.log('CLEANING A MODEL', model);
        
        if( model.senderObj )
            this.updateContacts( model.senderObj.id.user, model.senderObj.displayName );
        
        if( model.text ){
            event = {
                type: 'message',
                from: this.getContact( model.senderObj.id.user ),
                message: model.text
            };
        }else if( model.eventType === 'i' && model.subtype === 'add' ){
            event = {
                type: 'user added', // by someone else in the group
                who: model.recipients.map( r => this.getContact( r.user ) ),
                by: this.getContact( model.senderObj.id.user )
            };
        }else if( model.eventType === 'i' && model.subtype == 'invite' ){
            event = {
                type: 'user joined', // by invitation link
                who: model.recipients.map( r => this.getContact( r.user ) )
            };
        }else if( model.eventType === 'i' && model.subtype == 'remove' ){
            event = {
                type: 'user removed', // by someone else in the group
                who: model.recipients.map( r => this.getContact( r.user ) ),
                by: this.getContact( model.senderObj.id.user )
            };
        }else if( model.eventType === 'i' && model.subtype === 'leave' ){
            event = {
                type: 'user left', // removed theirselves from the group
                who: model.recipients.map( r => this.getContact( r.user ) )
            };
        }
            
        return event;
    }
    
    getContact( id ){
        const contact = this.contacts.find( c => c.id === id );
        
        if( contact )
            return contact.name;
        return `+${id}`;
    }
    
    updateContacts( id, name ) {
        const index = this.contacts.map( c => c.id ).indexOf( id );

        if( index === -1 )
            this.contacts.push( { id, name } );
        else if( this.contacts[index].name !== name )
            this.contacts[ index ] = { id, name };
        else 
            return;
            
        window.postMessage( {
            action: 'SYNC_CONTACTS',
            content: this.chats
        } );
        console.info( `[WhatSlackListener] # ${id} is now known as ${name}` );
    }

    updateChats() {
        console.info( '[WhatSlackListener]   updateChats' );
        if( Store && Store.Msg && Store.Msg.models ) {
            Store.Msg.models.forEach( model => {
                const index = this.chats.map( c => c.id ).indexOf( model.chat.id.user );
                const value = {
                    id: model.chat.id.user,
                    name: model.chat.name
                };

                if( index === -1 )
                    this.chats.push( value );
                else
                    this.chats[ index ] = value;
            } );

            window.postMessage( {
                action: 'SYNC_CHATS',
                content: this.chats
            } );

            console.log( '[WhatSlackListener] # Found chats:', { chats: this.chats } );
        } else {
            console.log( '[WhatSlackListener] # No chats (conversations) found' );
        }
    }

    updateForward( chatId, channelId ) {
        console.info( '[WhatSlackListener]   updateForward', { chatId, channelId } );
        const index = this.forwards.map( f => f.chatId ).indexOf( chatId );

        if( index === -1 )
            this.forwards.push( { chatId, channelId } );
        else
            this.forwards[ index ] = { chatId, channelId };

        window.postMessage( {
            action: 'SYNC_FORWARDS',
            content: this.forwards
        } );
    }
}

/* --------------------
        LET'S GO
---------------------*/

( () => {
    let listener;
    let app = document.querySelector( '#app' );

    // Add listener for info pane opening
    app.addEventListener( 'click', ( e ) => {
        const title = e.target.getAttribute( 'title' );
        const isBackBtn = e.target.getAttribute( 'data-icon' ) === 'back-light';
        if( isBackBtn || title === 'Group info' || title === 'Contact info' )
            setTimeout( makePane, 10 );
    } );

    // Add listener for content scritp messages
    window.addEventListener( 'message', ( e ) => {
        if( e.source != window )
            return;

        if( e.data.action === 'START_APP' )
            makeStore().then( () => {
                if( !listener ) {
                    console.log( '[WhatSlackListener] # Starting with received data:', e.data.content );
                    listener = new WhatSlackListener( e.data.content );
                    listener.updateChats();
                    listener.start();
                }
            } );

    }, false );

    window.handleSelect = ( select ) => {
        if( !select )
            return;
            
        console.info( '[WhatSlackListener]   handleSelect' );
        const option = select.querySelector( 'option:checked' );

        if( option )
            listener.updateForward( option.dataset.chatId, option.dataset.channelId );
    }

    const makeStore = () => {
        console.info( '[WhatSlackListener]   makeStore' );
        return new Promise( ( resolve, reject ) => {
            if( !window.Store ) {
                function getStore( modules ) {
                    let foundCount = 0;
                    let neededObjects = [
                        { id: 'Store', conditions: ( module ) => ( module.Chat && module.Msg ) ? module : null },
                        { id: 'Wap', conditions: ( module ) => ( module.createGroup ) ? module : null },
                        { id: 'MediaCollection', conditions: ( module ) => ( module.default && module.default.prototype && module.default.prototype.processFiles !== undefined ) ? module.default : null },
                        { id: 'WapDelete', conditions: ( module ) => ( module.sendConversationDelete && module.sendConversationDelete.length == 2 ) ? module : null },
                        { id: 'Conn', conditions: ( module ) => ( module.default && module.default.ref && module.default.refTTL ) ? module.default : null },
                        { id: 'WapQuery', conditions: ( module ) => ( module.queryExist ) ? module : null },
                        { id: 'ProtoConstructor', conditions: ( module ) => ( module.prototype && module.prototype.constructor.toString().indexOf( 'binaryProtocol deprecated version' ) >= 0 ) ? module : null },
                        { id: 'UserConstructor', conditions: ( module ) => ( module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser ) ? module.default : null }
                    ];

                    for( let idx in modules ) {
                        if( ( typeof modules[ idx ] === 'object' ) && ( modules[ idx ] !== null ) ) {
                            let first = Object.values( modules[ idx ] )[ 0 ];
                            if( ( typeof first === 'object' ) && ( first.exports ) ) {
                                for( let idx2 in modules[ idx ] ) {
                                    let module = modules( idx2 );
                                    if( !module )
                                        continue;

                                    neededObjects.forEach( ( needObj ) => {
                                        if( !needObj.conditions || needObj.foundedModule ) return;
                                        let neededModule = needObj.conditions( module );
                                        if( neededModule !== null ) {
                                            foundCount++;
                                            needObj.foundedModule = neededModule;
                                        }
                                    } );

                                    if( foundCount == neededObjects.length )
                                        break;
                                }

                                let neededStore = neededObjects.find( ( needObj ) => needObj.id === 'Store' );
                                window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
                                neededObjects.splice( neededObjects.indexOf( neededStore ), 1 );
                                neededObjects.forEach( ( needObj ) => {
                                    if( needObj.foundedModule )
                                        window.Store[ needObj.id ] = needObj.foundedModule;
                                } );

                                return window.Store;
                            }
                        }
                    }
                }

                //setTimeout( () => {
                webpackJsonp( [], { 'parasite': ( x, y, z ) => getStore( z ) }, 'parasite' );
                resolve();
                //}, 5000 );
            } else {
                reject();
            }
        } );
    };

    const makePane = () => {
        console.info( '[WhatSlackListener]   makePane' );

        if( document.querySelector( '.whtslck' ) )
            return; // because pane was already added to DOM.

        const sidebar = document.querySelector( '.three .copyable-area > div > div' );
        const container = sidebar.querySelector( '.copyable-text' );
        if( !listener || !container )
            return; // because the sidebar is not open.    

        let chatName = container.innerHTML;
        if( container.querySelector( '.emoji' ) )
            chatName = chatName
            .split( '<img ' )
            .map( p => p.startsWith( 'class=' ) ? p.match( /data-plain-text="(\S+)"/ )[ 1 ] : p )
            .join( '' );

        const chatMatches = listener.chats.filter( c => c.name === chatName );
        let htmlId, htmlPane;

        console.log( '[WhatSlackListener] # Retrieved info for', chatName, ':', chatMatches );

        if( chatMatches.length === 0 ) {
            htmlPane = `<div class="whtslck">
                <div class="wtitle">WhatSlack message forwarding</div>
                This chat is not known to WhatSlack (perhaps because it is very new?). Reloading WhatsApp Web should fix this issue.
                <button onclick="location.reload();">Reload</button>
            </div>`;
        } else if( chatMatches.length !== 1 ) {
            htmlPane = `<div class="whtslck">
                <div class="wtitle">WhatSlack message forwarding</div>
                You have multiple conversations with the same chat name, making WhatSlack unable to identify which chat is which. 
                Forwarding will still work (because it uses unique IDs rather than names), but you cannot edit your forwarding rules 
                from here for now. Clearing WhatSlack's save data might fix this issue.
                <button onclick="window.postMessage({action: 'OPEN_OPTIONS'});">Options</button>
            </div>`;
        } else { // chatMatches.length === 1
            const chat = chatMatches[ 0 ];
            const forward = listener.forwards.find( f => f.chatId === chat.id );

            if( forward ) {
                const channel = listener.channels.find( c => c.id === forward.channelId );

                if( channel ) {
                    chat.channelId = channel.id;
                    chat.channelName = channel.name;
                }
            }

            htmlId = `<span class="whtsppid" title="${chat.name}'s WhatsApp ID is ${chat.id}">${chat.id}</span>`;
            htmlPane = `<div class="whtslck">
            	<div class="wtitle">Message forwarding</div>
                Slack channel to forward new messages in this conversation to:
                <select onchange="handleSelect(this)">
                    <option data-chatId="${chat.id}" data-channelId="" ${chat.channelId ? '' : 'selected'}>Don't forward</option>
                    ${listener.channels.map(
                        c => `<option data-chat-id="${chat.id}" data-channel-id="${c.id}" ${c.id === chat.channelId ? 'selected' : ''}>#${c.name}</option>`
                    )}
                </select>
            </div>`;
        }

        if( htmlId ) {
            const fragId = document.createRange().createContextualFragment( htmlId );
            container.parentNode.style.flexWrap = 'wrap';
            container.parentNode.style.paddingBottom = '10px';
            container.parentNode.appendChild( fragId );
        }
        if( htmlPane ) {
            const fragPane = document.createRange().createContextualFragment( htmlPane );
            sidebar.insertBefore( fragPane, sidebar.children[ 4 ] );
        }
    };

    console.info( '[WhatSlackListener]   loaded' );
} )();
