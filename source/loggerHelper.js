this.addLogWithLimit = function( msg, widthLimit ) {

    if ( msg.length > widthLimit ) {

        var shortMsg = msg.substring( 0, widthLimit );
        var spaceIndex = shortMsg.lastIndexOf( " " );

        this.addLog( msg.substring( 0, spaceIndex ) );
        this.addLogWithLimit( msg.substring( spaceIndex, msg.length ), widthLimit );

    } else {

        this.addLog( msg );
        
    }
}