import express from "express";
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth'
import * as hre from "hardhat";

if (process.env.GOOGLE_CREDENTIAL_JSON) {
    admin.initializeApp({
        credential: admin.credential.cert(
            JSON.parse(process.env.GOOGLE_CREDENTIAL_JSON)
        )
    });
} else {
    admin.initializeApp();
}
admin.firestore().settings({ ignoreUndefinedProperties: true })

async function decodeIDToken(req: any, res: any, next: any) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const idToken = req.headers.authorization.split(' ')[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const uid = decodedToken.id();
        req['currentUser'] = await getAuth().getUser(uid);
        next();
    } else {
        return
    }
}

const app = express();
app.use(decodeIDToken);

app.post("/newwallet/:email", async (req, res) => {
    const txHash = await hre.run("clone", {
        email: req.params.email,
        async: true
    });
    res.send({txHash});
});

const port = 8080;
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});