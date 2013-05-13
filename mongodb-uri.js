/**
 * Creates a parser.
 *
 * @param {Object=} options
 * @constructor
 */
function MongodbUriParser(options) {
    if (options && options.scheme) {
        this.scheme = options.scheme;
    }
}

/**
 * Takes a URI of the form:
 *
 *   mongodb://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database][?options]
 *
 * and returns an object of the form:
 *
 *   {
 *       href: !String,
 *       protocol: !String,
 *       username: String,
 *       password: String,
 *       hosts: [{ host: String, port: Number }],
 *       database: String,
 *       options: !Object
 *   }
 *
 * href, protocol, and hosts will always be present. Other fields will only be present in the result if they were
 * present in the input.
 *
 * @param {!String} uri
 * @return {Object}
 */
MongodbUriParser.prototype.parse = function parse(uri) {

    var uriObject = {
        href: uri
    };

    var i = uri.indexOf('://');
    if (i < 0) {
        throw new Error('No protocol found in URI ' + uri);
    }
    uriObject.protocol = uri.substring(0, i + 1);
    if (this.scheme && this.scheme !== uri.substring(0, i)) {
        throw new Error('URI must begin with ' + this.scheme + '://');
    }
    var rest = uri.substring(i + 3);

    i = rest.indexOf('@');
    if (i >= 0) {
        var credentials = rest.substring(0, i);
        rest = rest.substring(i + 1);
        i = credentials.indexOf(':');
        if (i >= 0) {
            uriObject.username = decodeURIComponent(credentials.substring(0, i));
            uriObject.password = decodeURIComponent(credentials.substring(i + 1));
        } else {
            uriObject.username = decodeURIComponent(credentials);
        }
    }

    i = rest.indexOf('?');
    if (i >= 0) {
        var options = rest.substring(i + 1);
        rest = rest.substring(0, i);
        uriObject.options = {};
        options.split(',').forEach(function (o) {
            var iEquals = o.indexOf('=');
            uriObject.options[decodeURIComponent(o.substring(0, iEquals))] = decodeURIComponent(o.substring(iEquals + 1));
        });
    }

    i = rest.indexOf('/');
    if (i >= 0) {
        uriObject.database = decodeURIComponent(rest.substring(i + 1));
        rest = rest.substring(0, i);
    }

    this._parseAddress(rest, uriObject);

    return uriObject;

};

/**
 * Parses the address into the uriObject, mutating it.
 *
 * @param {!String} address
 * @param {!Object} uriObject
 * @private
 */
MongodbUriParser.prototype._parseAddress = function _parseAddress(address, uriObject) {
    uriObject.hosts = [];
    address.split(',').forEach(function (h) {
        var i = h.indexOf(':');
        if (i >= 0) {
            uriObject.hosts.push(
                    {
                        host: decodeURIComponent(h.substring(0, i)),
                        port: parseInt(h.substring(i + 1))
                    }
            );
        } else {
            uriObject.hosts.push({ host: decodeURIComponent(h) });
        }
    });
};

/**
 * Takes a URI object and returns a URI string of the form:
 *
 *   mongodb://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/database][?options]
 *
 * href, if present in the input, is ignored.
 *
 * @param {Object=} uriObject
 * @return {String}
 */
MongodbUriParser.prototype.format = function format(uriObject) {

    if (!uriObject) {
        return (this.scheme || 'mongodb') + '://localhost';
    }

    if (this.scheme && uriObject.protocol && this.scheme + ':' !== uriObject.scheme) {
        throw new Error('')
    }

    var uri;
    if (this.scheme) {
        uri = this.scheme + '://';
    } else if (uriObject.protocol) {
        uri = uriObject.protocol + '//';
    } else {
        uri = 'mongodb://';
    }

    if (uriObject.username) {
        uri += encodeURIComponent(uriObject.username);
        // While it's not to the official spec, we allow empty passwords
        if (uriObject.password) {
            uri += ':' + encodeURIComponent(uriObject.password);
        }
        uri += '@';
    }

    uri += this._formatAddress(uriObject);

    // While it's not to the official spec, we only put a slash if there's a database, independent of whether there are options
    if (uriObject.database) {
        uri += '/' + encodeURIComponent(uriObject.database);
    }

    if (uriObject.options) {
        Object.keys(uriObject.options).forEach(function (k, i) {
            uri += i === 0 ? '?' : ',';
            uri += encodeURIComponent(k) + '=' + encodeURIComponent(uriObject.options[k]);
        });
    }

    return uri;

};

/**
 * Formats the address portion of the uriObject, returning it.
 *
 * @param {!Object} uriObject
 * @return {String}
 * @private
 */
MongodbUriParser.prototype._formatAddress = function _formatAddress(uriObject) {
    var address = '';
    uriObject.hosts.forEach(function (h, i) {
        if (i > 0) {
            address += ',';
        }
        address += encodeURIComponent(h.host);
        if (h.port) {
            address += ':' + encodeURIComponent(h.port);
        }
    });
    return address;
};

exports.MongodbUriParser = MongodbUriParser;

var defaultParser = new MongodbUriParser();
['parse', 'format'].forEach(function (f) {
    exports[f] = defaultParser[f].bind(defaultParser);
});
