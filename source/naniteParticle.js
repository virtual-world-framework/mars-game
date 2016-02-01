this.initialize = function() {
    this.future( 1 ).move();
}

this.move = function() {
    var x, y, z;
    x = this.stop[ 0 ] - this.start[ 0 ];
    y = this.stop[ 1 ] - this.start[ 1 ];
    z = this.stop[ 2 ] - this.start[ 2 ];
    var ln = Math.sqrt( ( x * x ) + ( y * y ) + ( z * z ) );
    var dir = [ x / ln, y / ln, z / ln ];
    var rand = Math.random();
    var dist = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) + Math.pow( z, 2 ) );
    var trans = [
        this.start[ 0 ] + ( rand * dist * dir[ 0 ] ),
        this.start[ 1 ] + ( rand * dist * dir[ 1 ] ),
        this.start[ 2 ] + ( rand * dist * dir[ 2 ] )
    ];
    this.translation = trans;
    this.future( 0.05 ).move();
}

//@ sourceURL=naniteParticle.js