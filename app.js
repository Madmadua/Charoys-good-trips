var   express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , restler = require('restler')

console.log( 'starting application' );

server.listen( process.env.PORT || 80 );

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'isecretlyeatfish'}));



var store=(function(){

    var uid = 1

    var groups = {};

    var Acomodation = function Trip( options ){

        this.authorId = options.authorId
        this.name = options.name || 'unamed'
        this.id = 'trip-'+( uid ++ )
        this.city = 'Nancy'
        this.date = new Date()
        this.transports = []
        this.acomodations = []

    }
    Acomodation.prototype={
        toJSON:function(){
            return JSON.stringify( this )
        },
        parse:function(attr){
            return attr
        },
        set:function(key,value,options){
            if( typeof(key)=='object' )
                options=value;
            else
                key=[value]

            if( options || options.parse )
                key = this.parse( key )

            for( var i in key )
                this[ i ] = key[ i ];
        },
    }

    var Trip = function Trip( options ){

        this.authorId = options.authorId
        this.name = options.name || 'unamed'
        this.id = 'trip-'+( uid ++ )
        this.city = 'Nancy'
        this.date = new Date()
        this.transports = []
        this.acomodations = []

    }
    Trip.prototype={
        toJSON:function(){

            var ts=""
            for( var h in this.transports )
                ts+= ','+this.transports[ h ].toJSON()

            var as=""
            for( var h in this.acomodations )
                as+= ','+this.acomodations[ h ].toJSON()

            return '{'+[
                '"name":"'+this.name+'"',
                '"id":"'+this.id+'"',
                '"city":"'+this.city+'"',
                '"date":"'+this.date+'"',
                '"authorId":"'+this.authorId+'"',
                '"transports":['+ ts.substr(1) +']',
                '"acomodations":['+ as.substr(1) +']',
            ].join(',')+'}'
        },
        parse:function(attr){
            var p=['name','city','date'],o={};

            for(var i=p.length;i--;)
                if( attr[ p[i] ] )
                    o[ p[i] ]=attr[ p[i] ]
            return o
        },
        set:function(key,value,options){
            if( typeof(key)=='object' )
                options=value;
            else
                key=[value]

            if( options || options.parse )
                key = this.parse( key )

            for( var i in key )
                this[ i ] = key[ i ];
        },
    }


    var User = function User( options ){
        var hash = options.hash,
            userName = options.userName || 'Guest-'+( uid ++ ),
            id = 'user-'+( uid ++ )

        this.name = userName
        this.hash = hash
        this.id = id
    }
    User.prototype={
        toJSON:function(){
            return '{"name":"'+this.name+'","id":"'+this.id+'"}'
        },
        set:function(key,value,options){
            if( typeof(key)=='object' )
                options=value;
            else
                key=[value]

            for( var i in key )
                this[ i ] = key[ i ];
        },
    }


    var Group = function Group( options ){

        options = options || {}

        var groupHash = options.groupHash || Math.random().toString( 36 ).substr(4)+( uid.toString(36) )

        this.hash = groupHash
        this.name = options.name || "unnamed"
        this.users =  {}
        this.trips = []
        this.id = 'group-'+( uid ++ )

    }
    Group.prototype={


        createTrip:function( options ){

            var trip = new Trip(options)

            trip.parent = this

            return this.trips[ trip.id ] = trip
        },

        getTrip:function( options ){
            var name = options.name,
                id = options.id

            if( id )
                return this.trips[ id ]

            if( name )
                for( var id in this.trips )
                    if( this.trips[ name ].name == name )
                        return this.trips[ name ]

            return
        },

        /**
         * create an user to the specific group
         * name not required
         */
        createUser:function( options ){

            var user = new User(options)

            user.parent = this;

            return this.users[ user.hash ] = user
        },

        /**
         * retreive an user,
         * on the specific group, based on it's hash or name
         * if the flag 'create' is true, create the user if it does not exist
         */
        getUser:function( options ){

            var hash = options.hash,
                name = options.name,
                id = options.id

            if( hash )
                if( this.users[ hash ] )
                    return this.users[ hash ]
                else
                    return options.create ? this.createUser( options ) : null

            if( name )
                for( var hash in this.users )
                    if( this.users[ hash ].name == name )
                        return this.users[ hash ]

            if( userId )
                for( var hash in this.users )
                    if( this.users[ hash ].id == id )
                        return this.users[ hash ]

            return
        },

        set:function(key,value,options){
            if( typeof(key)=='object' )
                options=value;
            else
                key=[value]

            for( var i in key )
                this[ i ] = key[ i ];
        },

        toJSON:function(){

            var us=""
            for( var h in this.users )
                us+= ','+this.users[ h ].toJSON()

            var ts=""
            for( var h in this.trips )
                ts+= ','+this.trips[ h ].toJSON()

            return '{"hash":"'+this.hash+'","name":"'+this.name+'","id":"'+this.id+'","users":[' + us.substr( 1 ) + '],"trips":[' + ts.substr( 1 ) + ']}'
        },
    }


    /**
     * create a group
     */
    var createGroup=function( options ){
        var grp = new Group(options)
        return groups[ grp.hash ] = grp;
    }

    /**
     * retreive a group
     */
    var getGroup=function( options ){
        var hash = options.hash,
            name = options.name,
            id = options.id

        if( hash )
            return groups[ hash ]

        if( name )
            for( var hash in groups )
                if( groups[ hash ].name == name )
                    return groups[ hash ]

        if( id )
            for( var hash in groups )
                if( groups[ hash ].id == id )
                    return groups[ hash ]
    }


    // exposure
    return {
        createGroup : createGroup,
        getGroup : getGroup,
    }
})()




/**
 * group related request
 */
app.put('/groups', function (req, res) {

    var grp = store.createGroup()

    grp.createUser({
        hash : req.sessionID,
    })

    res.send( grp ? grp.toJSON()  : '{}' );
});
app.get('/groups/:groupHash', function (req, res) {
    var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( grp )
        grp.getUser({
            hash : req.sessionID,
            create : true
        })

    res.send( grp ? grp.toJSON()  : '{}' );
});
app.put('/groups/:groupHash', function (req, res) {
    var grp = store.getGroup({
        hash: req.params.groupHash
    })

    var p=['name'],o={};

    for(var i=p.length;i--;)
        if( req.body[ p[i] ] )
            o[ p[i] ]=req.body[ p[i] ]

    if( grp )
        grp.set( o )

    res.send( grp ? grp.toJSON() : '{}' );
});


/**
 * user related request
 */
app.get('/groups/:groupHash/users/:userId', function (req, res) {
    var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var user = grp.getUser({
        id : req.params.userId,
    })

    res.send( user ? user.toJSON() : '{}' );
});
app.put('/groups/:groupHash/users/:userHash', function (req, res) {
    var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var user = grp.getUser({
        id : req.params.userId,
    })

    if( !user )
        return res.send( '{}' );

    var p=['name'],o={};

    for(var i=p.length;i--;)
        if( req.body[ p[i] ] )
            o[ p[i] ]=req.body[ p[i] ]


    user.set( o )

    res.send( user ? user.toJSON() : '{}' );
});



/**
 * trips related request
 */
app.put('/groups/:groupHash/trips', function (req, res) {
    var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var trip = grp.createTrip( req.body )

    res.send( trip ? trip.toJSON() : '{}' );
});
app.get('/groups/:groupHash/trips/:tripId', function (req, res) {
    var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var trip = grp.getTrip({
        id : req.params.tripId,
    })

    res.send( trip ? trip.toJSON() : '{}' );
});
app.put('/groups/:groupHash/trips/:tripId', function (req, res) {
    var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var trip = grp.getTrip({
        id : req.params.tripId,
    })

    if( !trip )
        return res.send( '{}' );

    trip.set( req.body , {'parse':true} )

    res.send( trip ? trip.toJSON() : '{}' );
});


/**
 * acomodations related request
 */
app.put('/groups/:groupHash/trips/:tripId/acomodations', function (req, res) {
     var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var trip = grp.getTrip({
        id : req.params.tripId,
    })

    if( !trip )
        return res.send( '{}' );

    var aco = trip.createAcomodation( rep.body )

    res.send( aco ? aco.toJSON() : '{}' );
});
app.get('/groups/:groupHash/trips/:tripId/acomodations/:acoId', function (req, res) {
     var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var trip = grp.getTrip({
        id : req.params.tripId,
    })

    if( !trip )
        return res.send( '{}' );

    var aco = trip.getAco({
        id : req.params.acoId,
    })

    res.send( aco ? aco.toJSON() : '{}' );
});
app.put('/groups/:groupHash/trips/:tripId/acomodations/:acoId', function (req, res) {
     var grp = store.getGroup({
        hash: req.params.groupHash
    })

    if( !grp )
        return res.send( '{}' );

    var trip = grp.getTrip({
        id : req.params.tripId,
    })

    if( !trip )
        return res.send( '{}' );

    var aco = trip.getAco({
        id : req.params.acoId,
    })

    aco.set( req.body , {'parse':true} )

    res.send( aco ? aco.toJSON() : '{}' );
});




// proxy
app.post('/proxy', function (req, res) {     
    restler.get( req.body.url , {})
    .on('complete', function (data) {
        res.json(data)
    });
});

// index page
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/app/index.html');
});

// files
app.get( /(.*)$/, function (req, res) {
    res.sendfile(__dirname + '/app/'+ req.params[0] );
});


