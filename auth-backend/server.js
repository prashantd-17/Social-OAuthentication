import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json())

//Google
const client = new OAuth2Client('100465429990-t0gtmrues8c89gr844poea5m5ej06epl.apps.googleusercontent.com');

//Facebook
const FACEBOOK_APP_ID = '706713732013888';
const FACEBOOK_APP_SECRET = 'af2ddf8a14a5eb317a41082a310c23d9';

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

// app.post('/auth/facebook', async(req, res)=>{
//     const {accessToken} = req.body;

//     try{
//         //verify access token
//         const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;
//         const debugRes = await axios.get(debugUrl);
//         if (!debugRes.data.data.is_valid) {
//             return res.status(401).json({ error: 'Invalid Facebook token' });
//           }
      
//           // Get user info
//           const userInfoUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
//           const userInfoRes = await axios.get(userInfoUrl);
//           const user = userInfoRes.data;
      
//           res.json({ message: 'User authenticated', user });
//         } catch (err) {
//           console.error(err);
//           res.status(500).json({ error: 'Facebook auth failed' });
//     }
// })

app.post('/auth/facebook', async (req, res) => {
    const { accessToken } = req.body;
  
    try {
      // Validate token with Facebook
      const fbRes = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
      const profile = await fbRes.json();
  
      if (profile.error) {
        throw new Error(profile.error.message);
      }
  
      const { id, name, email, picture } = profile;
  
      // You can now store this user or start a session
      res.json({ message: 'User authenticated via Facebook', id, name, email, picture });
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: 'Invalid Facebook access token' });
    }
  });
  

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log('Auth server running on port')
})
