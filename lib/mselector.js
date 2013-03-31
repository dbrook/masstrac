/* 
 * Filename: mselector.js
 * 
 * Programmers:
 *  Jivani Cassar, UMass Lowell Student (jivani_cassar@student.uml.edu)
 *  Daniel Brook, UMass Lowell Student (daniel_brook@student.uml.edu)
 * 
 * Page updated by Daniel Brook on 2013-03-30 at 9:00 AM
 * 
 * This file contains the JavaScript code to populate station names into the
 * selection interface for mselectindex.html.
 */

function loadstations()
{
  // Build some temporary structures to make working with jQuery easier.
  var myStations = [];
  var red_line = [];
  var orange_line = [];
  var blue_line = [];
  var green_line = [];
  var fitchburg_line = [];
  var haverhill_line = [];
  var prov_stough_line = [];
  var worcester_line = [];
  var needham_line = [];
  var franklin_line = [];
  var king_plym_line = [];
  var middleborough_line = [];
  var greenbush_line = [];
  var fairmount_line = [];
  var newb_rock_line = [];
  var lowell_line = [];
  
  var i, j;
  
  for (i=0; i<masstrac.stations.length; i++) {
    myStations.push(masstrac.stations[i].name);
    
    for (j=0; j<masstrac.stations[i].svcs.length; j++) {
      
      switch (masstrac.stations[i].svcs[j]) {
        case "red":
          red_line.push(masstrac.stations[i].name);
          break;
        case "orange":
          orange_line.push(masstrac.stations[i].name);
          break;
        case "blue":
          blue_line.push(masstrac.stations[i].name);
          break;
        case "green":
          green_line.push(masstrac.stations[i].name);
          break;
        case "fitchburg":
          fitchburg_line.push(masstrac.stations[i].name);
          break;
        case "haverhill":
          haverhill_line.push(masstrac.stations[i].name);
          break;
        case "prov_stough":
          prov_stough_line.push(masstrac.stations[i].name);
          break;
        case "worcester":
          worcester_line.push(masstrac.stations[i].name);
          break;
        case "needham":
          needham_line.push(masstrac.stations[i].name);
          break;
        case "franklin":
          franklin_line.push(masstrac.stations[i].name);
          break;
        case "king_plym":
          king_plym_line.push(masstrac.stations[i].name);
          break;
        case "middleborough":
          middleborough_line.push(masstrac.stations[i].name);
          break;
        case "greenbush":
          greenbush_line.push(masstrac.stations[i].name);
          break;
        case "fairmount":
          fairmount_line.push(masstrac.stations[i].name);
          break;
        case "newb_rock":
          newb_rock_line.push(masstrac.stations[i].name);
          break;
        case "lowell":
          lowell_line.push(masstrac.stations[i].name);
          break;
      }
    }
  }
  
  // Now make these all alphabetized for easier navigation
  myStations.sort();
  red_line.sort();
  orange_line.sort();
  blue_line.sort();
  green_line.sort();
  fitchburg_line.sort();
  haverhill_line.sort();
  prov_stough_line.sort();
  worcester_line.sort();
  needham_line.sort();
  franklin_line.sort();
  king_plym_line.sort();
  middleborough_line.sort();
  greenbush_line.sort();
  fairmount_line.sort();
  newb_rock_line.sort();
  lowell_line.sort();
  
  // Make the section with all the station names in it
  
  var allStations = $("#allSta").attr('data-role', 'listview');
  for (i = 0; i < myStations.length; i++)
    allStations.append("<li><a href='marrival.html?name=" + myStations[i] +
                       "' data-ajax='false'>" + myStations[i] + "</a></li>");
  
  /*
   * Get access to the DOM elements and make sure they are set to be
   * listviews (as their data-role) for jQuery Mobile to show them properly.
   */
  var redlist = $("#r_content").attr('data-role','listview');
  var orangelist = $("#o_content").attr('data-role','listview');
  var bluelist = $("#b_content").attr('data-role','listview');
  var greenlist = $("#g_content").attr('data-role','listview');
  var fitchburg_list = $("#fitchburg_cont").attr('data-role','listview');
  var haverhill_list = $("#haverhill_cont").attr('data-role','listview');
  var prov_stough_list = $("#prov_stough_cont").attr('data-role','listview');
  var worcester_list = $("#worcester_cont").attr('data-role','listview');
  var needham_list = $("#needham_cont").attr('data-role','listview');
  var franklin_list = $("#franklin_cont").attr('data-role','listview');
  var king_plym_list = $("#king_plym_cont").attr('data-role','listview');
  var middleborough_list = $("#middleborough_cont").attr('data-role','listview');
  var greenbush_list = $("#greenbush_cont").attr('data-role','listview');
  var fairmount_list = $("#fairmount_cont").attr('data-role','listview');
  var newb_rock_list = $("#newb_rock_cont").attr('data-role','listview');
  var lowell_list = $("#lowell_cont").attr('data-role','listview');
  
  
  // For each array of stations (per line) populate the sublists with stations.
  
  for (i=0; i<red_line.length; i++) {
    redlist.append("<li><a href='marrival.html?name=" + red_line[i] +
                   "&line=red' data-ajax='false'>" + red_line[i] + "</a></li>");
  }
  $("#r_content").append(redlist);
  
  for (i=0; i<orange_line.length; i++) {
    orangelist.append("<li><a href='marrival.html?name=" + orange_line[i] +
                      "&line=orange' data-ajax='false'>" + orange_line[i] + "</a></li>");
  }
  $("#o_content").append(orangelist);
            
  for (i=0; i<blue_line.length; i++) {
    bluelist.append("<li><a href='marrival.html?name=" + blue_line[i] +
                    "&line=blue' data-ajax='false'>" + blue_line[i] + "</a></li>");
  }
  $("#b_content").append(bluelist);
            
  for (i=0; i<green_line.length; i++) {
    greenlist.append("<li><a href='marrival.html?name=" + green_line[i] +
                     "&line=green' data-ajax='false'>" + green_line[i] + "</a></li>");
  }
  $("#g_content").append(greenlist);
  
  for (i=0; i<fitchburg_line.length;i++)
    fitchburg_list.append("<li><a href='marrival.html?name=" + fitchburg_line[i] +
                          "&line=fitchburg' data-ajax='false'>" + fitchburg_line[i] + "</a></li>");
  $("#fitchburg_cont").append(fitchburg_list);
  
  for (i=0; i<haverhill_line.length;i++)
    haverhill_list.append("<li><a href='marrival.html?name=" + haverhill_line[i] +
                          "&line=haverhill' data-ajax='false'>" + haverhill_line[i] + "</a></li>");
  $("#haverhill_cont").append(haverhill_list);
  
  for (i=0; i<prov_stough_line.length;i++)
    prov_stough_list.append("<li><a href='marrival.html?name=" + prov_stough_line[i] +
                            "&line=prov_stough' data-ajax='false'>" + prov_stough_line[i] + "</a></li>");
  $("#prov_stough_cont").append(prov_stough_list);
  
  for (i=0; i<worcester_line.length;i++)
    worcester_list.append("<li><a href='marrival.html?name=" + worcester_line[i] +
                          "&line=worcester' data-ajax='false'>" + worcester_line[i] + "</a></li>");
  $("#worcester_cont").append(worcester_list);
  
  for (i=0; i<needham_line.length;i++)
    needham_list.append("<li><a href='marrival.html?name=" + needham_line[i] +
                        "&line=needham' data-ajax='false'>" + needham_line[i] + "</a></li>");
  $("#needham_cont").append(needham_list);
  
  for (i=0; i<franklin_line.length;i++)
    franklin_list.append("<li><a href='marrival.html?name=" + franklin_line[i] +
                         "&line=franklin' data-ajax='false'>" + franklin_line[i] + "</a></li>");
  $("#franklin_cont").append(franklin_list);
  
  for (i=0; i<king_plym_line.length;i++)
    king_plym_list.append("<li><a href='marrival.html?name=" + king_plym_line[i] +
                          "&line=king_plym' data-ajax='false'>" + king_plym_line[i] + "</a></li>");
  $("#king_plym_cont").append(king_plym_list);
  
  for (i=0; i<middleborough_line.length;i++)
    middleborough_list.append("<li><a href='marrival.html?name=" + middleborough_line[i] +
                              "&line=middleborough' data-ajax='false'>" + middleborough_line[i] + "</a></li>");
  $("#middleborough_cont").append(middleborough_list);
  
  for (i=0; i<greenbush_line.length;i++)
    greenbush_list.append("<li><a href='marrival.html?name=" + greenbush_line[i] +
                          "&line=greenbush' data-ajax='false'>" + greenbush_line[i] + "</a></li>");
  $("#greenbush_cont").append(greenbush_list);
  
  for (i=0; i<fairmount_line.length;i++)
    fairmount_list.append("<li><a href='marrival.html?name=" + fairmount_line[i] +
                          "&line=fairmount' data-ajax='false'>" + fairmount_line[i] + "</a></li>");
  $("#fairmount_cont").append(fairmount_list);
  
  for (i=0; i<newb_rock_line.length;i++)
    newb_rock_list.append("<li><a href='marrival.html?name=" + newb_rock_line[i] +
                          "&line=newb_rock' data-ajax='false'>" + newb_rock_line[i] + "</a></li>");
  $("#newb_rock_cont").append(newb_rock_list);
  
  for (i=0; i<lowell_line.length;i++)
    lowell_list.append("<li><a href='marrival.html?name=" + lowell_line[i] +
                       "&line=lowell' data-ajax='false'>" + lowell_line[i] + "</a></li>");
  $("#lowell_cont").append(lowell_list);
  
  /*
   * This is needed to take the dynamically-created list and make it
   * into a jQuery Mobile listview.
   */
  $("#r_content").listview('refresh');
  $("#o_content").listview('refresh');
  $("#b_content").listview('refresh');
  $("#g_content").listview('refresh');
  $("#c_content").listview('refresh');
  $("#fitchburg_cont").listview('refresh');
  $("#haverhill_cont").listview('refresh');
  $("#prov_stough_cont").listview('refresh');
  $("#worcester_cont").listview('refresh');
  $("#needham_cont").listview('refresh');
  $("#franklin_cont").listview('refresh');
  $("#king_plym_cont").listview('refresh');
  $("#middleborough_cont").listview('refresh');
  $("#greenbush_cont").listview('refresh');
  $("#fairmount_cont").listview('refresh');
  $("#newb_rock_cont").listview('refresh');
  $("#lowell_cont").listview('refresh');
  $("#allSta").listview('refresh');
}
