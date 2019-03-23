export default class WhatSlackListener {
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
        this.LISTENER_TOKEN = setInterval( () => this.ping(), 10 );
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
    
    async updateContacts( id, name ) {
        const index = this.contacts.map( c => c.id ).indexOf( id );

        if( index === -1 )
            this.contacts.push( { id, name } );
        else if( this.contacts[index].name !== name )
            this.contacts[ index ] = { id, name };
        else 
            throw new Error( 'Contact does not require an update' );
            
        window.postMessage( {
            action: 'SYNC_CONTACTS',
            content: this.contacts
        } );
        
        console.info( `[WhatSlackListener] # ${id} is now known as ${name}` );
        return true;
    }

    async updateChats() {
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
            return true;
        } 
        throw new Error( 'No chats found' );
    }

    async updateForward( chatId, channelId ) {
        const index = this.forwards.map( f => f.chatId ).indexOf( chatId );

        if( index === -1 )
            this.forwards.push( { chatId, channelId } );
        else if( this.forwards[index].channelId !== channelId )
            this.forwards[ index ] = { chatId, channelId };
        else 
            throw new Error( 'Contact does not require an update' );

        window.postMessage( {
            action: 'SYNC_FORWARDS',
            content: this.forwards
        } );
        return true;
    }
}
