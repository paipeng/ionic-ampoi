var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);




var roles = [
             {
             name: 'admin',
             description: 'Admin role'
             },
             {
             name: 'user',
             description: 'User role'
             },
             {
             name: 'guest',
             description: 'Guest Anonymous role'
             }
             ];

var accounts = [
                {
                username: 'pai',
                email: 'foo@bar.com',
                password: 'test',
                created: new Date(),
                lastUpdated: new Date()
                },
                {
                username: 'test',
                email: 'baz@qux.com',
                password: 'test',
                created: new Date(),
                lastUpdated: new Date()
                }
                ];

var acls = [
            {
            accessType: "*",
            permission: "DENY",
            principalType: "ROLE",
            principalId: "$everyone"
            },
            {
            model: "AmUser",
            property: "find",
            accessType: "READ",
            permission: "ALLOW",
            principalType: "ROLE",
            principalId: "$authenticated"
            }
            ];


var pois = [
            {
            name: "Hardenbergplatz",
            geopoint: "52.506192,13.332400",
            type: 0
            }, {
            name: "apparent media",
            geopoint: "52.509203,13.323838",
            type: 0
            }, {
            name: "Blitzer",
            geopoint: "52.490830,13.330926",
            type: 0
            }
            ];

app.datasources['mysql'].automigrate(['RoleMapping','Role', 'AccessToken', 'AmUser', 'ACL', 'location', 'photo', 'poi'], function(err) {
     console.log(err);
                                     var ACL = app.models.ACL;
                                     
                                     acls.forEach(function(acl) {
                                                  ACL.create(acl, function(err, record) {
                                                             console.log('Record created: ', record);
                                                             });
                                                  });
                                     
                                     var Role = app.models.Role;
                                     
                                     roles.forEach(function(role) {
                                                   Role.create(role, function(err, record) {
                                                               console.log('Record created: ', record);
                                                               });
                                                   });
                                     var AmUser = app.models.AmUser;
                                     accounts.forEach(function(account) {
                                                      console.log('try create user');
                                                      AmUser.create(account, function(err, record) {
                                                                    if (err) return console.log(err);
                                                                    
                                                                    console.log('user Record created:', record);
                                                                    });
                                                      });
                                     var Poi = app.models.poi;
                                     pois.forEach(function(poi) {
                                                  Poi.create(poi, function(err, record) {
                                                             if (err) return console.log(err);
                                                             
                                                             console.log('poi Record created:', record);
                                                             
                                                             });
                                                  });
                                     
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
