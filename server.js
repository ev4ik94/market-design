const { createServer } = require('http')
const { parse } = require('url')
const express = require('express');
const next = require('next')
const sslRedirect = require('heroku-ssl-redirect').default;

const PORT = process.env.PORT || 3001;
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express();

    // Express's middleware to automatically redirect to 'https'.
    server.use(sslRedirect());

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, err => {
        if (err) throw err;

        console.log(`Server starts on ${PORT}.`);
    });
})
