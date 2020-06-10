
var popups = [];

// Clear Window cache + create alarms on install
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.remove("popups", function () {
        console.log("Cleared popup cache");
    });
    create_alarms();
});

// Clear Window cache + create alarms on restart
chrome.runtime.onStartup.addListener(function () {
    chrome.storage.local.remove("popups", function () {
        console.log("Cleared popup cache");
    });
    create_alarms();
});

// Closed window listener
chrome.windows.onRemoved.addListener(function(id) {
    chrome.storage.local.get(['popups'], function(result) {
        popups = result.popups;
        index = popups.indexOf(id);
        if (index > -1) {
            popups.splice(index, 1);
        }
        chrome.storage.local.set({popups: popups}, function() {});
    });
});

// Popup comms
 chrome.extension.onConnect.addListener(function(port) {
      port.onMessage.addListener(function(msg) {
           console.log("message recieved: " + msg);
           if (msg === "info_up") {
               chrome.storage.local.get(['info_wid_id'], function(result) {
                    let info_wid_id = result.info_wid_id;
                    if (info_wid_id !== undefined) {
                        chrome.windows.update(info_wid_id, {focused: true});
                    }
                });
           } else if (msg === "info_down") {
                chrome.storage.local.get(['info_wid_id'], function(result) {
                    let info_wid_id = result.info_wid_id;
                    if (info_wid_id !== undefined) {
                        chrome.windows.update(info_wid_id, {state: "minimized"});
                    }
                });
           } else {
               chrome.storage.local.set({last_triggered: msg});
               infoWindow(msg);
                if (msg === "gretchenandrew") {
                    gretchenandrew();
                } else if (msg === "sofiacrespo") {
                    sofiacrespo();
                } else if (msg === "jakeelwes") {
                    jakeelwes();
                } else if (msg === "disnovation") {
                    disnovation();
                } else if (msg === "bengrosser") {
                    bengrosser();
                } else if (msg === "libbyheaney") {
                    libbyheaney();
             }
           } 
      });
 });
 
 //Popup functions
 
 function openWindow(dims, fullscreen, url) {
    optionsDictionary = {url: url, type: "popup"};
    if (fullscreen) {
        optionsDictionary.state = "fullscreen";
    } else {
        optionsDictionary.left = dims[0];
        optionsDictionary.top = dims[1];
        optionsDictionary.width = dims[2];
        optionsDictionary.height = dims[3];

    }
    return new Promise((resolve, reject) => {
        try {
          chrome.windows.create(optionsDictionary, function (newWindow) {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else {
              let new_id = newWindow.id;
              resolve(new_id);
            }
          });
        } catch (error) {
            reject (error);
        };
    });
}

async function openMultiple(dims, urls) {
    if (dims.length !== urls.length) {
        console.log("Number of dims and urls do not match");
        return;
    }
    let new_popups = [];
    let num_popups = dims.length;
    var i;
      for (i = 0; i < num_popups; i++) {
        
        let new_dims = dims[i];
        var id = await openWindow(new_dims, false, urls[i]);
        new_popups.push(id);
      };
    console.log("Func ended popups: " + new_popups + ", length :" + new_popups.length);
    storePopupID(new_popups);
}

function storePopupID(id) {
    chrome.storage.local.get(['popups'], function(result) {
        popups = result.popups;
        if (popups === undefined){
            popups = [];
        }
        if (Number.isInteger(id)) {
            popups.push(id);
        } else if (Array.isArray(id)) {
            id.forEach(id_num => popups.push(id_num));
        }
        console.log("saving:" + popups);
        chrome.storage.local.set({popups: popups}, function () {
            console.log(popups);
        });
    });
}

infoWindow = async (artist) => {
    let width = 500;
    let height = 200;
    let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
    ];
    let id = await openWindow(dims, false,"/info/info_window.html");
    storePopupID(id);
    chrome.storage.local.set({info_wid_id: id});
};

// Artist functions

// Gretchen Andrew

gretchenandrew = () => {
    let dims = [window.screen.availWidth - 100,
        window.screen.availHeight - 100];
    let dims_array = [];
    let url_array = ["https://the-next-american-president.com/","https://cover-of-artforum.com/"];
    var i;
    for (i = 0; i < url_array.length; i++) {
      let new_left = 
              (window.screen.availWidth - dims[0]) * Math.random();
      let new_top = 
              (window.screen.availHeight - dims[1]) * Math.random();
      let new_dims = [
          parseInt(new_left),
          parseInt(new_top),
          parseInt(dims[0]),
          parseInt(dims[1])
      ];
      dims_array.push(new_dims);
    }
    dims = [500, 665];
    for (i = 0; i < 10; i++) {
      let new_left = 
              (window.screen.availWidth - dims[0]) * Math.random();
      let new_top = 
              (window.screen.availHeight - dims[1]) * Math.random();
      let new_dims = [
          parseInt(new_left),
          parseInt(new_top),
          parseInt(dims[0]),
          parseInt(dims[1])
      ];
      dims_array.push(new_dims);
      url_array.push("popups/gretchenandrew/"+i+".html");
    };
    openMultiple(dims_array, url_array);
};

sofiacrespo = async() => {
  let dims = [0,0,window.screen.availWidth, window.screen.availHeight];
  let id = await openWindow(dims, false,"https://darkfractures.com/example/index.html");
  storePopupID(id);
};

disnovation = async() => {
  let dims = [0,0,window.screen.availWidth, window.screen.availHeight];
  let id = await openWindow(dims, false,"/popups/disnovation/predictiveartbot.html");
  storePopupID(id);
};

jakeelwes = () => {
    let size = window.screen.availWidth / 3;
    let top = (window.screen.availHeight - size) / 2;
    let dims = [size, size];
    let dims_array = [];
    let url_array = [];
    var i;
    for (i = 0; i < 3; i++) {
        let new_left = i * size;
        let new_dims = [
            parseInt(new_left),
            parseInt(top),
            parseInt(dims[0]),
            parseInt(dims[1])
        ];
        dims_array.push(new_dims);
        url_array.push("popups/jakeelwes/"+i+".html");
    };
    openMultiple(dims_array, url_array);
    
};

bengrosser = async() => {
  let width = window.screen.availWidth - 100;  
  let height = window.screen.availHeight - 100;
  let dims = [
      (window.screen.availWidth - width) / 2,
      (window.screen.availHeight - height) / 2,
      width,
      height
  ];
  let id = await openWindow(dims, false,"popups/bengrosser/tracingyou.html");
  storePopupID(id);
};

libbyheaney = () => {
    let width = window.screen.availWidth / 2;
    let height = (width / 16) * 9;
    let top = (window.screen.availHeight - height) / 2;
    let dims = [width, height];
    let dims_array = [];
    let url_array = [];
    var i;
    for (i = 0; i < 2; i++) {
        let new_left = i * width;
        let new_dims = [
            parseInt(new_left),
            parseInt(top),
            parseInt(dims[0]),
            parseInt(dims[1])
        ];
        dims_array.push(new_dims);
        url_array.push("popups/libbyheaney/" + i + ".html");
    }
    ;
    openMultiple(dims_array, url_array);

};

// Timers
var times = [11,12,13,14,15,16];
//var times = [1,2,3,4,5,6]; // For debug


var artists_funcs = [gretchenandrew, sofiacrespo, disnovation, 
    jakeelwes, bengrosser, libbyheaney];

var create_alarm = (pos) => {
    let now = new Date();
    // Alarm today:
    now.setHours(times[pos],00,00);
//    now.setMinutes(now.getMinutes() + times[pos]); // For debug
    // As UTC timestamp:
    new_time = now.getTime();
    // Is it in the past? Add 1 day
    if (new_time < Date.now()) {
//        console.log("In the past");
        new_time += 86400000;
    // Or is it less than a minute? Add a minute
    } else if ((new_time - Date.now()) < 60000 ) {
        new_time += 60000;
    }
//    console.log("Milliseconds till alarm " + (new_time - Date.now() ));
    let alarm_info = {
        when:new_time,
        periodInMinutes: 1440
    };
    chrome.alarms.create(artists_funcs[pos].name, alarm_info);
};

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log("Triggered:"+alarm.name);
    alarm_offset = Date.now() - alarm.scheduledTime;
    if (alarm_offset < 66000) {
//    if (alarm.name === "gretchenandrew") {
//        gretchenandrew();
//    } else if (alarm.name === "sofiacrespo") {
//        sofiacrespo();
//    } else if (alarm.name === "jakeelwes") {
//        jakeelwes();
//    } else if (alarm.name === "disnovation") {
//        disnovation();
//    } else if (alarm.name === "bengrosser") {
//        bengrosser();
//    } else if (alarm.name === "libbyheaney") {
//        libbyheaney();
//    }
      chrome.storage.local.set({last_triggered: alarm.name});
    } else {
        console.log("Missed " + alarm.name);
    }
    chrome.alarms.getAll(function(alarms) {
        alarms.forEach(function(saved_alarm) {
            if (saved_alarm.name === alarm.name) {
                alarm_time = new Date(saved_alarm.scheduledTime);
                console.log("Alarm: "+saved_alarm.name+", Next Time: "+alarm_time);
            }
        });
    });
});

var create_alarms = () => {
    chrome.alarms.getAll(function(alarms) {
        chrome.alarms.clearAll();
        for (i = 0; i < times.length; i++) {
            create_alarm(i);
        }
        chrome.alarms.getAll(function(alarms) {
            alarms.forEach(function(alarm) {
               alarm_time = new Date(alarm.scheduledTime);
               console.log("Alarm: "+alarm.name+", Time: "+alarm_time); 
            });
        });
    });
 };
 
