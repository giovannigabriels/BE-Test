const dotenv = require("dotenv");
dotenv.config();
const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: process.env.REDIS_SERVER || '127.0.0.1',
		port: +process.env.REDIS_PORT || 6379,
    }
});

client.connect();

module.exports = client;