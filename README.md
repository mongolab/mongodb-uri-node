# mongodb-uri

Parse and format MongoDB URIs of the form:

```
mongodb://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database][?options]
```

Note that there are two minor differences between this format and the
[standard MongoDB connect string URI format](http://docs.mongodb.org/manual/reference/connection-string/):

1. `password` is optional even when a `username` is supplied
2. The slash before the `database` is not required when leaving out the `database` but specifying `options`

Neither of these differences should prevent this library from parsing any URI conforming to the standard format.

## Usage

### parse

Takes a URI of the form:

```
    mongodb://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database][?options]
```

and returns an object of the form:

```javascript
    {
        scheme: !String,
        username: String,
        password: String,
        hosts: [ { host: String, port: Number } ],
        database: String,
        options: !Object
    }
```

`scheme` and `hosts` will always be present. Other fields will only be present in the result if they were present in the
input.

#### Example

```javascript
var mongodbUri = require('mongodb-uri');
var uriObject = mongodbUri.parse('mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authenticationDatabase=%40dmin');
console.log(JSON.stringify(uriObject, null, 4));
```

```
{
    "scheme": "mongodb",
    "hosts": [
        {
            "host": "host",
            "port": 1234
        }
    ],
    "username": "user:n@me",
    "password": "p@ssword",
    "options": {
        "authenticationDatabase": "@dmin"
    },
    "database": "d@tabase"
}
```

### format

Takes a URI object and returns a URI string of the form:

```
    mongodb://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database][?options]
```

#### Example

```javascript
var mongodbUri = require('mongodb-uri');
var uri = mongodbUri.format(
        {
            username: 'user:n@me',
            password: 'p@ssword',
            hosts: [
                {
                    host: 'host',
                    port: 1234
                }
            ],
            database: 'd@tabase',
            options: {
                authenticationDatabase: '@dmin'
            }
        }
);
console.log(uri);
```

```
mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authenticationDatabase=%40dmin
```

### formatMongoose

Takes either a URI object or string in standard format and returns a Mongoose connection string. Specifically,
instead of listing all hosts and ports in a single URI, a Mongoose connection string contains a list of URIs each
with a single host and port pair.

#### Examples

```javascript
var mongodbUri = require('mongodb-uri');
var uri = mongodbUri.formatMongoose('mongodb://user%3An%40me:p%40ssword@host:1234,host:5678/d%40tabase?authenticationDatabase=%40dmin');
console.log(uri);
```

```
mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authenticationDatabase=%40dmin,mongodb://user%3An%40me:p%40ssword@host:5678/d%40tabase?authenticationDatabase=%40dmin
```
