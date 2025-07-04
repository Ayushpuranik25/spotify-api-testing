const { request, test, expect } = require('@playwright/test');

const userId = '31mo5hgyoxvblb2o4zivxkudds4i';
const spotify_create_playlist_url = `https://api.spotify.com/v1/users/${userId}/playlists`;
const clientId = 'ccdd54714c044a338ccf63a11db85114';
const clientSecret = '0421e12e35764b6ca02619221383fe88';
const redirectUri = 'https://oauth.pstmn.io/v1/browser-callback';
const refreshToken = 'AQBQT9-tLCU8A8OuzaDAhsVYUloKG1UM1ACLbjBxM2b_NbvD29HgitwAmXHsldo0v2UmF8CyqtuU_PO5HU0_p5PiSvrop_Iz_-hwqKIMe-y6cdUWi0wAIGNDckiB9_DadhUUTW8EsHHg7t5qR7oyjm_DIRBbLWj0EazNBIfxPQ_STkU3pNw73REd-R9FWIT91RTS_SxVCEc3j0uHcvBfMUGpW11NZZQhlA36HjZ1PNMoH8Olb3I9b00WzWutN2o'


async function getAccessToken() {
  const context = await request.newContext();

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await context.post(tokenUrl, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`
  });

  const data = await response.json();
  console.log('Token refresh response:', data);

  if (response.ok) {
    return data.access_token;
  } else {
    throw new Error(`Failed to refresh access token: ${data.error_description || data.error}`);
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

})





