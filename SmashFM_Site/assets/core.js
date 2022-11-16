var $;

const updateStats = () => {
  $.get(`https://tempserver.itssmash.net/api/nowplaying/1`, (res) => {
    $('#song').text(res.now_playing.song.title);
    $('#artist').text(res.now_playing.song.artist);
    $('#dj').text(res.live.streamer_name || 'AutoDJ');
    $('#last').text(`Last Played: ${res.song_history[0].song.text}`)
    $('#album-art').attr("src", res.now_playing.song.art);
    $('#listeners').text(`${res.listeners.total} listener${res.listeners.total == 1 ? '' : 's'}`);
  });
};

updateStats();
setInterval(updateStats, 5000);

const togglePlayback = () => {
  const stream = $('#stream');
  stream.volume = $('#volume-slider').val() / 100;
  if (stream[0].paused) {
    stream.attr('src', 'https://tempserver.itssmash.net/radio/8000/radio.mp3');
    $('#play-button').attr('class', 'fa fa-spin fa-spinner-third');
    stream[0]
      .play()
      .then(() => {
        $('#play-button').attr('class', 'fas fa-pause');
      })
      .catch((e) => {
        console.error(e);
        $('#play-button').attr('class', 'fas fa-play');
      });
  } else {
    stream.attr('src', '');
    stream[0].pause();
    $('#play-button').attr('class', 'fas fa-play');
  };
};

$('.player-control').click(togglePlayback);

$('#volume-slider').on("input", (e) => {
  $('#stream')[0].volume = $(e.currentTarget).val() / 100;
});