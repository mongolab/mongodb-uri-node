/*
 * Copyright (c) 2013 ObjectLabs Corporation
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 */

var mongodbUri = require('./mongodb-uri');
var should = require('should');

var testCases = [
    {
        standardUri: 'mongodb://host',
        mongooseConnectionString: 'mongodb://host',
        uriObject: {
            scheme: 'mongodb',
            hosts: [
                {
                    host: 'host'
                }
            ]
        }
    },
    {
        standardUri: 'mongodb://host:1234',
        mongooseConnectionString: 'mongodb://host:1234',
        uriObject: {
            scheme: 'mongodb',
            hosts: [
                {
                    host: 'host',
                    port: 1234
                }
            ]
        }
    },
    {
        standardUri: 'mongodb://host:1234/database',
        mongooseConnectionString: 'mongodb://host:1234/database',
        uriObject: {
            scheme: 'mongodb',
            hosts: [
                {
                    host: 'host',
                    port: 1234
                }
            ],
            database: 'database'
        }
    },
    {
        standardUri: 'mongodb://username@host:1234/database',
        mongooseConnectionString: 'mongodb://username@host:1234/database',
        uriObject: {
            scheme: 'mongodb',
            username: 'username',
            hosts: [
                {
                    host: 'host',
                    port: 1234
                }
            ],
            database: 'database'
        }
    },
    {
        standardUri: 'mongodb://username:password@host:1234/database',
        mongooseConnectionString: 'mongodb://username:password@host:1234/database',
        uriObject: {
            scheme: 'mongodb',
            username: 'username',
            password: 'password',
            hosts: [
                {
                    host: 'host',
                    port: 1234
                }
            ],
            database: 'database'
        }
    },
    {
        standardUri: 'mongodb://username:password@host:1234/database?authSource=admin',
        mongooseConnectionString: 'mongodb://username:password@host:1234/database?authSource=admin',
        uriObject: {
            scheme: 'mongodb',
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
                authSource: 'admin'
            }
        }
    },
    {
        standardUri: 'mongodb://username:password@host:1234,host2:1235/database?authSource=admin',
        mongooseConnectionString: 'mongodb://username:password@host:1234/database?authSource=admin,mongodb://username:password@host2:1235/database?authSource=admin',
        uriObject: {
            scheme: 'mongodb',
            username: 'username',
            password: 'password',
            hosts: [
                {
                    host: 'host',
                    port: 1234
                },
                {
                    host: 'host2',
                    port: 1235
                }
            ],
            database: 'database',
            options: {
                authSource: 'admin'
            }
        }
    },
    {
        standardUri: 'mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authSource=%40dmin',
        mongooseConnectionString: 'mongodb://user%3An%40me:p%40ssword@host:1234/d%40tabase?authSource=%40dmin',
        uriObject: {
            scheme: 'mongodb',
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
                authSource: '@dmin'
            }
        }
    },
    {
      standardUri: 'mongodb://username:password@host:1234/database?authSource=admin&maxPoolSize=5&replicaSet=tesla',
      mongooseConnectionString: 'mongodb://username:password@host:1234/database?authSource=admin&maxPoolSize=5&replicaSet=tesla',
      uriObject: {
        scheme: 'mongodb',
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
          authSource: 'admin',
          maxPoolSize: '5',
          replicaSet: 'tesla'
        }
      }
    }
];
Object.keys(testCases).forEach(function (t) {
    testCases[t].scheme = 'mongodb';
});

describe('mongodb-uri', function () {
    var strictParser = new mongodbUri.MongodbUriParser({ scheme: 'mongodb' });
    describe('.parse()', function () {
        testCases.forEach(function (test) {
            it('should handle "' + test.standardUri + '"', function () {
                mongodbUri.parse(test.standardUri).should.eql(test.uriObject);
            });
        });
        it('should handle a trailing slash with no database', function () {
            mongodbUri.parse('mongodb://localhost/').should.eql(
                    {
                        scheme: 'mongodb',
                        hosts: [
                            {
                                host: 'localhost'
                            }
                        ]
                    }
            );
            mongodbUri.parse('mongodb://localhost/?someOption=true').should.eql(
                    {
                        scheme: 'mongodb',
                        hosts: [
                            {
                                host: 'localhost'
                            }
                        ],
                        options: {
                            someOption: 'true'
                        }
                    }
            );
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
        testCases.forEach(function (test) {
            it('should handle "' + test.standardUri + '"', function () {
                mongodbUri.format(test.uriObject).should.eql(test.standardUri);
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
    describe('.formatMongoose()', function () {
        it('should handle no argument', function () {
            mongodbUri.formatMongoose().should.eql('mongodb://localhost');
        });
        testCases.forEach(function (test) {
            it('should handle "' + test.standardUri + '"', function () {
                mongodbUri.formatMongoose(test.standardUri).should.eql(test.mongooseConnectionString);
                mongodbUri.formatMongoose(test.uriObject).should.eql(test.mongooseConnectionString);
            });
        });
    });
});
