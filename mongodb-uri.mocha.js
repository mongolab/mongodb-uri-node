/*
 * Copyright (c) 2013 ObjectLabs Corporation
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 */

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
    testCases[t].scheme = 'mongodb';
});

describe('mongodb-uri', function () {
    var strictParser = new mongodbUri.MongodbUriParser({ scheme: 'mongodb' });
    describe('.parse()', function () {
        Object.keys(testCases).forEach(function (uri) {
            it('should handle "' + uri + '"', function () {
                mongodbUri.parse(uri).should.eql(testCases[uri]);
            });
        });
        it('should handle non-standard schemes', function () {
            mongodbUri.parse('somescheme://localhost').should.eql(
                    {
                        scheme: 'somescheme',
                        hosts: [
                            {
                                host: 'localhost'
                            }
                        ]
                    }
            );
        });
        it('should reject unexpected schemes', function () {
            (function () { strictParser.parse('somescheme://localhost'); }).should.throw();
        });
    });
    describe('.format()', function () {
        it('should handle no argument', function () {
            mongodbUri.format().should.eql('mongodb://localhost');
        });
        Object.keys(testCases).forEach(function (uri) {
            it('should handle "' + uri + '"', function () {
                mongodbUri.format(testCases[uri]).should.eql(uri);
            });
        });
        it('should handle non-standard schemes', function () {
            mongodbUri.format(
                    {
                        scheme: 'somescheme',
                        hosts: [
                            {
                                host: 'localhost'
                            }
                        ]
                    }
            ).should.eql('somescheme://localhost');
        });
        it('should reject unexpected schemes', function () {
            (function () {
                strictParser.format(
                        {
                            scheme: 'somescheme',
                            hosts: [
                                {
                                    host: 'localhost'
                                }
                            ]
                        }
                );
            }).should.throw();
        });
    });
});
