var mocha = require('jake-mocha');
mocha.defineTask(
        {
            name: 'mocha',
            files: 'mongodb-uri.mocha.js',
            mochaOptions: {
                ui: 'bdd',
                reporter: 'spec'
            }
        }
);
task('default', ['mocha']);
