module.exports = function configuration () {
    try {
        const yaml = require('js-yaml');
        const fs   = require('fs');
        const configuration = yaml.load (fs.readFileSync('./configuration.yaml', 'utf8'));
        console.log('> Local Smart Heat considered the configurations');
        return configuration;
    } catch (error) {
        console.log('> Local Smart Heat "configuration" Error:');
        console.log(error);
    }
}


