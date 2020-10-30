const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { magenta, green } = require('colors');
const { config } = require('dotenv');
const cors = require('cors');

const server = express();

config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const myOAtuhClient = new OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://developers.google.com/oauthplayground'
});

myOAtuhClient.setCredentials({
    refresh_token: REFRESH_TOKEN
})

const myAccessToken = myOAtuhClient.getAccessToken();

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: "OAuth2",
        user: "agulavalla@gmail.com",
        clientId: CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: myAccessToken
    }
});

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cors({credentials:true, origin:true}));

server.get('/api/', (req, res) => res.json({ message: 'Hello world' }));

server.post('/api/send-message', (req, res) => {

    const { name, email, message } = req.body;

    transport.sendMail({
        from: email,
        to:'agulavalla@gmail.com',
        subject: 'EMAIL FROM PORTFOLIO',
        html: `
            <span>from: </span> <strong>${email}<strong/>
            <h3>${name}:<h3/>
            <p>${message}</p>
        `
    }, (err, result) => {
        if(err) {
            return res.status(400).json({message:'Something were wrong :('});
        }
        transport.close();
        return res.json({ok:true, message:'Email successfully sent', result});
    })

});


const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`${magenta('Server on Port: ')} ${green(port)}`));