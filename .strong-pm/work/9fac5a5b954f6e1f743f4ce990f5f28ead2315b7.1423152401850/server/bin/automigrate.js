path = require('path');
var app = require(path.resolve(__dirname, '../server'));

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
var dataSource = app.dataSources.mysql;


dataSource.automigrate('AccessToken', function(err) {
  if (err) console.log(err);
});
dataSource.automigrate('ACL', function(err) {
  if (err) console.log(err);
  var ACL = app.models.ACL;

  acls.forEach(function(acl) {
    ACL.create(acl, function(err, record) {
      console.log('Record created: ', record);
    });
  });
});
dataSource.automigrate('RoleMapping', function(err) {
  if (err) console.log(err);
});
dataSource.automigrate('Role', function(err) {
  if (err) console.log(err);

  var Role = app.models.Role;

  roles.forEach(function(role) {
    Role.create(role, function(err, record) {
      console.log('Record created: ', record);
    });
  });
});

dataSource.automigrate('location', function(err) {
  if (err) console.log(err);

  var photo = app.models.photo;
  var count = accounts.length;

  /*
  accounts.forEach(function(account) {
    Account.create(account, function(err, record) {
      if (err) return console.log(err);

      console.log('Record created:', record);

      count--;

      if (count === 0) {
      }
    });
  });
  */
        console.log('done');
//        dataSource.disconnect();
});
dataSource.automigrate('photo', function(err) {
  if (err) console.log(err);

  console.log('photo done');
//  dataSource.disconnect();
});
dataSource.automigrate('AmUser', function(err) {
  if (err) console.log(err);

  var AmUser = app.models.AmUser;
  accounts.forEach(function(account) {
    console.log('try create user');
    AmUser.create(account, function(err, record) {
      if (err) return console.log(err);

      console.log('user Record created:', record);
    });
  });

  console.log('User done');
//  dataSource.disconnect();
});
dataSource.automigrate('poi', function(err) {
  if (err) console.log(err);

  var Poi = app.models.poi;
  var count = pois.length;
  pois.forEach(function(poi) {
    Poi.create(poi, function(err, record) {
      if (err) return console.log(err);

      count --;

      console.log('poi Record created:', record);
      if (count == 0) {
          console.log('poi done');
          //dataSource.disconnect();
      }
    });
  });
});
