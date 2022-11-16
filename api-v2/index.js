const axios = require("axios");
const express = require('express');
const app = express();
const port = 25582;

app.get('/', (req, res) => {
    res.redirect('/v2/stats');
})

app.get('/v2/stats', (req, res) => {
    axios.get('https://azura.itsmelody.pw/api/nowplaying/1').then(async data => {
        data = data.data;
        axios.get(`https://beta.xonos.tools/api/v2/lookup/song?title=${data.now_playing.song.title}&artist=${data.now_playing.song.artist}`).then(xonos => {
            xonos = xonos.data;
            if (xonos.found === true) {
                res.json({
                    response: true,
                    song: {
                        title: xonos.result.title,
                        artist: xonos.result.artist,
                        covers: {
                            big: xonos.result.covers.big,
                            medium: xonos.result.covers.medium,
                            small: xonos.result.covers.small
                        },
                        color: xonos.result.color,
                        explicit: xonos.result.explicit,
                        spotify: `https://open.spotify.com/track/${xonos.result.spotify_id}`
                    },
                    onAir: {
                        presenter: data.live.streamer_name || 'AutoDJ',
                        listeners: {
                            total: data.listeners.total,
                            unique: data.listeners.unique,
                            current: data.listeners.current
                        }
                    }
                })
            } else {
                res.json({
                    response: true,
                    song: {
                        title: data.now_playing.song.title,
                        artist: data.now_playing.song.artist,
                        covers: {
                            big: data.now_playing.song.art,
                            medium: data.now_playing.song.art,
                            small: data.now_playing.song.art
                        },
                        color: null,
                        explicit: null,
                        spotify: null
                    },
                    onAir: {
                        presenter: data.live.streamer_name || 'AutoDJ',
                        listeners: {
                            total: data.listeners.total,
                            unique: data.listeners.unique,
                            current: data.listeners.current
                        }
                    }
                })
            }
        })
    })
});

app.get('/v2/recentlyPlayed', async(req, res) => {
    await axios.get(`https://azura.itsmelody.pw/api/nowplaying/1`).then(async azuracast => {
        azuracast = azuracast.data;
        let song1;
        let song2;
        let song3;
        await axios.get(`https://beta.xonos.tools/api/v2/lookup/song?title=${azuracast.song_history[0].song.title}&artist=${azuracast.song_history[0].song.artist}`).then(data => {
            song1 = data.data;
            if (song1.found === false) {
                song1.result.title = azuracast.song_history[0].song.title
                song1.result.artist = azuracast.song_history[0].song.artist
                song1.result.covers.big = azuracast.song_history[0].song.art
                song1.result.covers.medium = azuracast.song_history[0].song.art
                song1.result.covers.small = azuracast.song_history[0].song.art
                song1.result.color = null
                song1.result.explicit = null
                song1.result.spotify_id = null
            }
        })
        await axios.get(`https://beta.xonos.tools/api/v2/lookup/song?title=${azuracast.song_history[1].song.title}&artist=${azuracast.song_history[1].song.artist}`).then(data => {
            song2 = data.data;
            if (song2.found === false) {
                song2.result.title = azuracast.song_history[1].song.title
                song2.result.artist = azuracast.song_history[1].song.artist
                song2.results.covers.big = azuracast.song_history[1].song.art
                song2.results.covers.medium = azuracast.song_history[1].song.art
                song2.results.covers.small = azuracast.song_history[1].song.art
                song2.result.color = null
                song2.result.explicit = null
                song2.result.spotify_id = null
            }
        })
        await axios.get(`https://beta.xonos.tools/api/v2/lookup/song?title=${azuracast.song_history[2].song.title}&artist=${azuracast.song_history[2].song.artist}`).then(data => {
            song3 = data.data;
            if (song3.found === false) {
                song3.result.title = azuracast.song_history[2].song.title
                song3.result.artist = azuracast.song_history[2].song.artist
                song3.results.covers.big = azuracast.song_history[2].song.art
                song3.results.covers.medium = azuracast.song_history[2].song.art
                song3.results.covers.small = azuracast.song_history[2].song.art
                song3.result.color = null
                song3.result.explicit = null
                song3.result.spotify_id = null
            }
        })
        res.json({
            response: true,
            one: {
                song: {
                    title: song1.result.title,
                    artist: song1.result.artist,
                    covers: {
                        big: song1.result.covers.big,
                        medium: song1.result.covers.medium,
                        small: song1.result.covers.small
                    },
                    color: song1.result.color,
                    explicit: song1.result.explicit,
                    spotify: `https://open.spotify.com/track/${song1.result.spotify_id}`
                },
                onAir: {
                    presenter: azuracast.song_history[0].streamer || 'AutoDJ'
                }
            },
            two: {
                song: {
                    title: song2.result.title,
                    artist: song2.result.artist,
                    covers: {
                        big: song2.result.covers.big,
                        medium: song2.result.covers.medium,
                        small: song2.result.covers.small
                    },
                    color: song2.result.color,
                    explicit: song2.result.explicit,
                    spotify: `https://open.spotify.com/track/${song2.result.spotify_id}`
                },
                onAir: {
                    presenter: azuracast.song_history[1].streamer || 'AutoDJ'
                }
            },
            three: {
                song: {
                    title: song3.result.title,
                    artist: song3.result.artist,
                    covers: {
                        big: song3.result.covers.big,
                        medium: song3.result.covers.medium,
                        small: song3.result.covers.small
                    },
                    color: song3.result.color,
                    explicit: song3.result.explicit,
                    spotify: `https://open.spotify.com/track/${song3.result.spotify_id}`
                },
                onAir: {
                    presenter: azuracast.song_history[2].streamer || 'AutoDJ'
                }
            }
        })
    })
});

app.listen(port, () => {
    console.log(`Melody API v2 listening on http://localhost:${port}`)
});
