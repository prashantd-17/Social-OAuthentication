import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json())

const client = new OAuth2Client('100465429990-t0gtmrues8c89gr844poea5m5ej06epl.apps.googleusercontent.com');

app.post('/auth/google', async(req, res)=>{
    const {idToken} = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience : '100465429990-t0gtmrues8c89gr844poea5m5ej06epl.apps.googleusercontent.com'
        });

        const payload = ticket.getPayload();

        // You can now access user info
        const {sub, email, name, picture } = payload;

        // Optional: Create user session or store in DB
        res.json({ message: 'User authenticated', email, name, picture });

    } catch (error) {
        console.log(error);
        res.status(401).json({error : 'Invalid Id token'})       
    }
});

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log('Auth server running on port')
})
