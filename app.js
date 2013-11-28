var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)


console.log( 'starting application' );

server.listen( process.env.PORT || 80 );

app.use(express.cookieParser());
app.use(express.session({secret: 'isecretlyeatfish'}));



var store=(function(){

    var uid = 1

    var groups = {};

    var createGroup=function(){

    }

    /**
     * create an user to the specific group
     * name not required
     */
    var createUser=function( options ){
        var groupHash = options.groupHash,
            userHash = options.userHash,
            userName = options.userName || 'Guest-'+( uid ++ )

        var user = {
            name : userName,
            hash : userHash
        }

        var grp = getGroup( groupHash )

        return grp.users[ userHash ] = user
    }

     /**
     * retreive an user,
     * on the specific group, based on it's hash or name
     * if the flag 'create' is true, create the user if it does not exist
     */
    var getUser=function( options ){
        var groupHash = options.groupHash,
            userHash = options.userHash,
            userName = options.userName

        var grp = getGroup( groupHash )

        if( userHash )
            if( grp.users[ userHash ] )
                return grp.users[ userHash ]
            else
                return options.create ? createUser( options ) : null

        for( var hash in grp.users )
            if( grp.users[ userHash ].name == userName )
                return grp.users[ userHash ]

        return
    }

    // exposure
    return {
        createUser : createUser,
        getUser : getUser,

    }
})()


app.put('/groups', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/groups/([0-9A-z]*)', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});



// index page
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// 
app.get( /^\/([0-9A-z.]*)$/, function (req, res) {
    console.log( "info: ask for the file "+req.params[0] );
    res.sendfile(__dirname + '/'+ req.params[0] );
});


