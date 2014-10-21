JsonEditor = function( containerId, json, name ) {
    this.initialize( containerId, json, name );
    return this;
}

JsonEditor.prototype = {
    constructor: JsonEditor,
    parent: undefined,
    rootObjects: undefined,
    initialize: function( containerId, json, name ) {
        this.rootObjects = {};
        if ( containerId ) {
            this.parent = document.getElementById( containerId );
        } else {
            this.parent = document.body;
        }
        if ( json ) {
            this.loadJson( json, name );
        }
    },
    loadJson: function( json, name ) {
        var entry;
        name = name || "Object";
        entry = this.createEntry( json, name );
        this.rootObjects[ name ] = entry;
        this.parent.appendChild( entry );
    },
    clearJson: function( name ) {
        var keys;
        if ( this.rootObjects[ name ] ) {
            this.parent.removeChild( this.rootObjects[ name ] );
            delete this.rootObjects[ name ];
        } else if ( name === undefined ) {
            keys = Object.keys( this.rootObjects );
            for ( var i = 0; i < keys.length; i++ ) {
                this.parent.removeChild( this.rootObjects[ keys[ i ] ] );
                delete this.rootObjects[ keys[ i ] ];
            }
        } else {
            console.log( "JSON element \"" + name + "\" not found!" );
        }
    },
    getJson: function() {
        // TODO: Add get Json by name option
        var json = {};
        var entry, path;
        var children = this.parent.getElementsByClassName( "entry" );
        for ( var i = 0; i < children.length; i++ ) {
            entry = children[ i ];
            if ( entry.parentPath ) {
                path = "json." + entry.parentPath;
            } else {
                path = "json";
            }
            eval( path )[ entry.jsonName ] = this.getEntryValue( entry );
        }
        return json;
    },
    getEntryValue: function( entry ) {
        var value;
        switch ( entry.valueType ) {
            case "boolean":
                value = entry.children[ 0 ].value;
                value = ( value === "true" );
                break;
            case "number":
                value = parseFloat( entry.children[ 0 ].value );
                break;
            case "string":
                value = entry.children[ 0 ].value;
                break;
            case "object":
                value = {};
                break;
            case "array":
                value = [];
                break;
            case "function":
                value = "Functions are not handled.";
                break;
            default:
                value = "Unhandled value type (" + entry.valueType + ").";
                break;
        }
        return value;
    },
    createEntry: function( json, name, path, parentType ) {
        var type = typeof json;
        var element = document.createElement( "div" );
        switch ( type ) {
            case "boolean":
                this.booleanSelector( element, name, json );
                element.valueType = type;
                element.jsonName = name;
                element.parentPath = path;
                break;
            case "number":
                this.numberField( element, name, json );
                element.valueType = type;
                element.jsonName = name;
                element.parentPath = path;
                break;
            case "string":
                this.stringField( element, name, json );
                element.valueType = type;
                element.jsonName = name;
                element.parentPath = path;
                break;
            case "object":
                // This includes arrays
                this.objectElement( element, name, json, path, parentType );
                break;
            case "function":
                element.appendChild(
                    document.createTextNode( name + ": Functions are not handled." )
                );
                element.className = "entry";
                element.valueType = type;
                element.jsonName = name;
                element.parentPath = path;
                break;
            default:
                element.appendChild(
                    document.createTextNode( name + ": Unhandled value type (" + type + ")." )
                );
                element.className = "entry";
                element.valueType = type;
                element.jsonName = name;
                element.parentPath = path;
                break;
        }
        return element;
    },
    objectElement: function( element, name, value, parent, parentType ) {
        var title, contents, keys, add;
        title = document.createElement( "div" );
        add = document.createElement( "div" );
        contents = document.createElement( "div" );
        add.innerHTML = "+";
        add.className = "addBtn";
        title.appendChild( document.createTextNode( "+ " + name ) );
        element.appendChild( add );
        title.className = "category entry";
        if ( value instanceof Array ) {
            title.valueType = "array";
        } else {
            title.valueType = "object";
        }
        title.jsonName = name;
        title.parentPath = parent;
        contents.className = "collapsible collapsed";
        title.onclick = this.expandObject;
        keys = Object.keys( value );
        if ( parentType === "array" ) {
            parent = parent ? parent + "[" + name + "]" : name;
        } else {
            parent = parent ? parent + "." + name : name;
        }
        for ( var i = 0; i < keys.length; i++ ) {
            contents.appendChild( this.createEntry( value[ keys[ i ] ], keys[ i ], parent ) );
        }
        element.appendChild( title );
        element.appendChild( contents );
        add.addEventListener( "click", ( function( event ) {
            this.addNewElement( title.valueType, contents, parent );
            event.stopPropagation();
        } ).bind( this ) );
        return element;
    },
    expandObject: function() {
        var contents = this.nextSibling;
        if ( contents.classList.contains( "collapsed" ) ) {
            contents.classList.remove( "collapsed" );
            this.innerHTML = this.innerHTML.replace( "+", "-" );
        } else {
            contents.classList.add( "collapsed" );
            this.innerHTML = this.innerHTML.replace( "-", "+" );
        }
    },
    addNewElement: function( parentType, contents, parent ) {
        var dialog = document.getElementById( "newElementDialog" );
        var name = document.getElementById( "elementName" );
        var type = document.getElementById( "elementType" );
        var submit = document.getElementById( "submitElement" );
        var cancel = document.getElementById( "cancelElement" );
        dialog.style.display = "block";
        if ( parentType === "array" ) {
            name.readOnly = true;
            name.value = contents.children.length;
        } else {
            name.readOnly = false;
            name.value = "";
        }
        submit.onclick = ( function( event ) {
            contents.appendChild( this.createEntry( this.getDefaultValue( type.value ), name.value, parent ) );
            dialog.style.display = "none";
            this.jsonUpdated();
        } ).bind( this );
        cancel.onclick = ( function( event ) {
            dialog.style.display = "none";
        } ).bind( this );
    },
    getDefaultValue: function( type ) {
        var value;
        switch ( type ) {
            case "boolean":
                value = true;
                break;
            case "number":
                value = 0;
                break;
            case "string":
                value = "";
                break;
            case "object":
                value = {};
                break;
            case "array":
                value = [];
                break;
        }
        return value;
    },
    booleanSelector: function( element, name, value ) {
        var select, option;
        element.appendChild( document.createTextNode( name + ": " ) );
        select = document.createElement( "select" );
        option = document.createElement( "option" );
        option.value = true;
        option.text = "True";
        select.appendChild( option );
        option = document.createElement( "option" );
        option.value = false;
        option.text = "False";
        select.appendChild( option );
        for ( var i = 0; i < select.options.length; i++ ) {
            select.options[ i ].selected = value.toString() === select.options[ i ].value;
        }
        element.appendChild( select );
        element.className = "entry";
        select.addEventListener( "change", this.jsonUpdated );
        return element;
    },
    stringField: function( element, name, value ) {
        var text;
        element.appendChild( document.createTextNode( name + ": " ) );
        text = document.createElement( "input" );
        text.value = value;
        element.appendChild( text );
        element.className = "entry";
        text.addEventListener( "blur", this.jsonUpdated );
        return element;
    },
    numberField: function( element, name, value ) {
        var text;
        element.appendChild( document.createTextNode( name + ": " ) );
        text = document.createElement( "input" );
        text.type = "number";
        text.value = value;
        element.appendChild( text );
        element.className = "entry";
        text.addEventListener( "blur", this.jsonUpdated );
        return element;
    },
    jsonUpdated: function( event ) {}
}

//@ sourceURL=editor/JsonEditor.js