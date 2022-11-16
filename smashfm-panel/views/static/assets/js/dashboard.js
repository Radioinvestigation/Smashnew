function getStats() {
    $.getJSON("https://api.itsmelody.pw", function(r) {
        $('#listeners').text(r.listeners.total)
        $('#dj').text(r.dj.name)
    })
}

getStats()
setInterval(getStats, 5000)