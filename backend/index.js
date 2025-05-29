const serverless = require('@vendia/serverless-express');
process.env.BABEL_CACHE_PATH='/tmp/babel-cache';
require('@babel/register');
const app = require('./app');

exports.handler = serverless({ app });
