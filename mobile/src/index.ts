import express, { Application, Request, Response } from 'express';
import * as authAppController from './controller/auth-app-controller';
import * as apn from 'apn';

const app: Application = express();

app.use(express.json());

app.use('/auth-app', authAppController.authAppSetupController);

app.get('/notification',  (req: Request, res: Response) => {
    var token = 'AAAAPx8g3qg:APA91bGPNh5eH8Ve_GuUBen_tkcrQnrAfVxUpl-09VLPKEJ5mrfbQ9Ql1S9qHnDszkqjZ0rylZIvjX4S9AR1gtw7rcuR-082q1-HEFxeSPK2uQWX4nWhvYYk1-BdrDH4WvYYLUxt-pvl';

    var service = new apn.Provider({
        // TO-DO: upload key of token
        // cert:  __dirname + '/cert.pem',
        // key: __dirname + '/key.pem',
        token: {
            key: "path/to/APNsAuthKey_XXXXXXXXXX.p8",
            keyId: 'TVFUJ52TJ7',
            teamId: '3G8W7M85MG',
        },
    });
    var note = new apn.Notification({
        expiry: Math.floor(Date.now() / 1000) + 3600,
        badge: 3,
        sound: "ping.aiff",
        alert: "\uD83D\uDCE7 \u2709 You have a new message",
        payload: {'messageFrom': 'Caroline'},
    });
    note.topic = 'hexlink';
    service.send(note, token).then( result => {
        console.log("sent:", result.sent.length);
        console.log("failed:", result.failed.length);
        console.log(result.failed);
    });

    res.status(200).json({ message: 'success'});
});

app.listen(8017);