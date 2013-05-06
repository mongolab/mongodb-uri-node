# mongodb-uri

Parse and format MongoDB URIs of the form:

```
mongodb://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database][?options]
```

Note that there are two minor differences between this format and the
[standard MongoDB connect string URI format](http://docs.mongodb.org/manual/reference/connection-string/):

1. `password` is optional even when a `username` is supplied
2. The slash before the `database` is not required when leaving out the `database` but specifying `options`

Neither of these differences should prevent this library from parsing any URI conforming to the standard format, but
make URIs more flexible.

## Usage

### parse

```javascript
var mongodbUri = require('mongodb-uri');
console.log(JSON.stringify(mongodbUri.parse('mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authenticationDatabase=%40dmin'), null, 4));
```

```
{
    "href": "mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authenticationDatabase=%40dmin",
    "protocol": "mongodb:",
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

```javascript
var mongodbUri = require('mongodb-uri');
console.log(mongodbUri.format
            (
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
            )
);
```

```
mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authenticationDatabase=%40dmin
```
