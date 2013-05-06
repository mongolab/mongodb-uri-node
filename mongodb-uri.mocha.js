var mongodbUri = require('./mongodb-uri');
var should = require('should');

var testCases = {
    'mongodb://host': {
        hosts: [
            {
                host: 'host'
            }
        ]
    },
    'mongodb://host:1234': {
        hosts: [
            {
                host: 'host',
                port: 1234
            }
        ]
    },
    'mongodb://host:1234/database': {
        hosts: [
            {
                host: 'host',
                port: 1234
            }
        ],
        database: 'database'
    },
    'mongodb://username@host:1234/database': {
        username: 'username',
        hosts: [
            {
                host: 'host',
                port: 1234
            }
        ],
        database: 'database'
    },
    'mongodb://username:password@host:1234/database': {
        username: 'username',
        password: 'password',
        hosts: [
            {
                host: 'host',
                port: 1234
            }
        ],
        database: 'database'
    },
    'mongodb://username:password@host:1234/database?authenticationDatabase=admin': {
        username: 'username',
        password: 'password',
        hosts: [
            {
                host: 'host',
                port: 1234
            }
        ],
        database: 'database',
        options: {
            authenticationDatabase: 'admin'
        }
    },
    'mongodb://username:password@host1:1234,host2:1235/database?authenticationDatabase=admin': {
        username: 'username',
        password: 'password',
        hosts: [
            {
                host: 'host1',
                port: 1234
            },
            {
                host: 'host2',
                port: 1235
            }
        ],
        database: 'database',
        options: {
            authenticationDatabase: 'admin'
        }
    },
    'mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authenticationDatabase=%40dmin': {
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
};
Object.keys(testCases).forEach(function (t) {
    testCases[t].href = t;
    testCases[t].protocol = 'mongodb:';
});

describe('mongodb-uri', function () {
    describe('.parse()', function () {
        Object.keys(testCases).forEach(function (uri) {
            it('should handle "' + uri + '"', function () {
                mongodbUri.parse(uri).should.eql(testCases[uri]);
            });
        });
    });
    describe('.format()', function () {
        Object.keys(testCases).forEach(function (uri) {
            it('should handle "' + uri + '"', function () {
                mongodbUri.format(testCases[uri]).should.eql(uri);
            });
        });
    });
});
