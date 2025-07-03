const { request, test, expect } = require('@playwright/test');

//const Access_Token = 'BQB-YNf7E67Pd5-1c1Rn9zSrHfgNW8kpvVGQhosS3HVN4-1CL_g1hIOSanWbd3p0rR5IQIDbbKT66iCjdQmaxWFYK8UcT0pxoD6vqICre8HorakKCldtvhy7erHUSx61cVNXSIXNGMa9sOrtsgH4-mp4e_DH4g6dTHT7odEfijhhGoqwcDnUJG5yUOxmCBEWxBYP_s785YLBSV25Up_GYcO9KI4CwXkRIcRMUuoYcCAAtCJtX2vtvkL670ATMwF5zchGWW43_HyMAHwZpD_E9g9YM5cdAhSVUYN2SowrEtkrxAA0DQNWMg';
const userId = '31mo5hgyoxvblb2o4zivxkudds4i';
const spotify_create_playlist_url = `https://api.spotify.com/v1/users/${userId}/playlists`;

const clientId = 'ccdd54714c044a338ccf63a11db85114';
const clientSecret = '0421e12e35764b6ca02619221383fe88';


async function getAccessToken() {
  const context = await request.newContext();

  
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await context.post(tokenUrl, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    //data: 'grant_type=client_credentials'
    data:` grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://localhost:3000/callback`
  });

  const data = await response.json();
  if (response.ok) {
    return data.access_token;
  } else {
    throw new Error(`Failed to get access token: ${data.error_description || data.error}`);
  }
}



test('Create Spotify playlist api testing', async () => {
    const Access_Token = await getAccessToken();

    const context = await request.newContext({
        extraHTTPHeaders: {
            Authorization: `Bearer ${Access_Token}`,
            'Content-Type': 'application/json'
        }
    })

    const response = await context.post(spotify_create_playlist_url, {
        data: {
            name: 'My playlists9',
            description: 'my fav playlist',
            public: true
        }
    })

    expect(response.status(), `Create playlist status`).toBe(201);
    console.log('create playlist status:', response.status());
    const { id: playlist_id } = await response.json();
    console.log('Created playlist:', playlist_id);
    const jsonData = await response.json();
    console.log(jsonData);


    const trackUris = ['spotify:track:72HdutlIHBZJ7WT1xVAAZT'];
    const addTrack = await context.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        data: { uris: trackUris }
    });

    console.log('Add tracks status:', addTrack.status());
    expect(addTrack.status(), `Add tracks status`).toBe(201);
    const addJson = await addTrack.json();
    console.log('Add tracks response:', addJson);



    //     const url = 'https://open.spotify.com/playlist/31mo5hgyoxvblb2o4zivxkudds4i';
    //     response = await request.get(url);
    //   expect(response.status()).toBe(200);
    //   const data = await response.json();
    //   console.log('Fetched data:', data);

})






