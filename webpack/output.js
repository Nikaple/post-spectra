'use strict';

var path = require('path');

module.exports = {
    path: path.join(process.cwd(), 'dist'),
    filename: 'js/[name].[hash].js'
};