
var d = new Date();
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var dayName = weekday[d.getDay()];
switchDay(0, dayName)



function switchDay(evt, day) {
  var i, timetableDay, tablinks;
  timetableDay = document.getElementsByClassName("timetableDay");
  for (i = 0; i < timetableDay.length; i++) {
    timetableDay[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(day).style.display = "grid";
}

var socket = io();
      socket.on('timetable:book', function(data){
        
        suffixTime = data.time;
        suffixTime = suffixTime.substr(0, suffixTime.indexOf(':'));

        if (suffixTime != "23") {
          suffixTime = Number(suffixTime) + 1;
          suffixTime = `${suffixTime}`;
        } else {
          suffixTime = `00`;
        }

        if (suffixTime.length === 1) {
            if (suffixTime.charAt(0) === "1" | suffixTime.charAt(0) === "2" || suffixTime.charAt(0) === "3" || suffixTime.charAt(0) === "4" || suffixTime.charAt(0) === "5" || suffixTime.charAt(0) === "6" || suffixTime.charAt(0) === "7" || suffixTime.charAt(0) === "8" || suffixTime.charAt(0) === "9") {
            suffixTime = `0${suffixTime}:00`;
          } else {
            suffixTime = `${suffixTime}:00`;
          }
        } else {
          suffixTime = `${suffixTime}:00`;
        }

        //console.log(`${data.time}-${suffixTime}`)
        //$(`#${data.day} p:contains('${data.time}-${suffixTime}')`).css('display', 'none'); 
        $(`#${data.day} p`).filter(function() {
          return $(this).text() === `${data.time}-${suffixTime}`;
        }).siblings("button").html(data.booked_by).siblings("img").attr('src', data.booked_by_avatar);

      });
      socket.on('timetable:unbook', function(data){
        //console.log(data)
        suffixTime = data.time;
        suffixTime = suffixTime.substr(0, suffixTime.indexOf(':'));

        if (suffixTime != "23") {
          suffixTime = Number(suffixTime) + 1;
          suffixTime = `${suffixTime}`;
        } else {
          suffixTime = `00`;
        }

        if (suffixTime.length === 1) {
            if (suffixTime.charAt(0) === "1" | suffixTime.charAt(0) === "2" || suffixTime.charAt(0) === "3" || suffixTime.charAt(0) === "4" || suffixTime.charAt(0) === "5" || suffixTime.charAt(0) === "6" || suffixTime.charAt(0) === "7" || suffixTime.charAt(0) === "8" || suffixTime.charAt(0) === "9") {
            suffixTime = `0${suffixTime}:00`;
          } else {
            suffixTime = `${suffixTime}:00`;
          }
        } else {
          suffixTime = `${suffixTime}:00`;
        }

        //console.log(`${data.time}-${suffixTime}`)
        //$(`#${data.day} p:contains('${data.time}-${suffixTime}')`).css('display', 'none'); 
        $(`#${data.day} p`).filter(function() {
          return $(this).text() === `${data.time}-${suffixTime}`;
        }).siblings("button").html('AutoDJ').attr('style', 'width: 100%;').siblings("img").attr('src', 'https://cdn.discordapp.com/attachments/872914348991983827/873669141318496356/image0.png').siblings("span").remove();
      });

      $('[id^="timeableBookButt"]').click(function (e) {
          e.preventDefault();

          if($(this).text() === "AutoDJ") {

            thisElement = $(this);
          $(this).html('<i class="fas fa-sync fa-spin"></i>');
          day = $(this).closest( '.timetableDay' ).attr('id');
          time = $(this).prev( '.timetableTime' ).text();
          time = time.substr(0, time.indexOf('-'));
          const id = $('#discord').text()
          var data = {};
          data.day = day;
          data.time = time;
          data.booked_by = $('#username').text();
          data.booked_by_avatar = `https://avatars.kie.lol/${id}`;
          data.discord = id
        
          $.ajax({
            url: './api/timetable/book',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
              if (response === "booked") {
                socket.emit('timetable:book', data);
                thisElement.parent().append("<span id=\"timetableunBook\" class=\"timetableunBook\"><i class=\"fas fa-times-circle\"></i></span>")
                thisElement.attr('style', 'width: 80%;');
                thisElement.html($('#username').text());
                thisElement.siblings('img').attr('src', `https://avatars.kie.lol/${id}`);
              }
            }
        });

          } else {
            e.preventDefault();
        }

      });

      $(document).on('click', '#timetableunBook' , function(e) {
          e.preventDefault();

          thisElement = $(this);
          $(this).html('<i class="fas fa-sync fa-spin"></i>');
          day = $(this).closest( '.timetableDay' ).attr('id');
          time = thisElement.siblings('p').text();
          time = time.substr(0, time.indexOf('-'));

          var data = {};
          data.day = day;
          data.time = time;

          $.ajax({
            url: './api/timetable/unbook',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
              if (response === "unbooked") {
                socket.emit('timetable:unbook', data);

                thisElement.siblings('button').removeAttr('style');
                thisElement.siblings('button').html("AutoDJ");
                thisElement.siblings('img').attr('src', 'https://cdn.discordapp.com/attachments/872914348991983827/873669141318496356/image0.png');
                thisElement.hide();
              }
            }
        });
      });

        switchDay(event, "0");