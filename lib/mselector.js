/* 
 * Filename: mselector.js
 * 
 * Programmers:
 *  Jivani Cassar, UMass Lowell Student (jivani_cassar@student.uml.edu)
 *  Daniel Brook, UMass Lowell Student (daniel_brook@student.uml.edu)
 * 
 * Page updated by Daniel Brook on 2013-03-29 at 10:00 PM
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
  var purple_line = [];
  var i, j;
  
  for (i=0; i<masstrac.stations.length; i++) {
    myStations.push(masstrac.stations[i].name);
    
    for (j=0; j<masstrac.stations[i].svcs.length; j++) {
      if (masstrac.stations[i].svcs[j] == "red") {
        red_line.push(masstrac.stations[i].name);
      } else if (masstrac.stations[i].svcs[j] == "orange") {
        orange_line.push(masstrac.stations[i].name);
      } else if (masstrac.stations[i].svcs[j] == "blue") {
        blue_line.push(masstrac.stations[i].name);
      } else if (masstrac.stations[i].svcs[j] == "green") {
        green_line.push(masstrac.stations[i].name);
      } else {
        purple_line.push(masstrac.stations[i].name);
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
  purple_line.sort();
  
  /*
   * Make the section with all the station names in it
   */
  var allStations = $("#allSta").attr('data-role', 'listview');
  for (i = 0; i < myStations.length; i++)
    allStations.append("<li><a href='#'>" + myStations[i] + "</a></li>");
  
  /*
   * Get access to the DOM elements and make sure they are set to be
   * listviews (as their data-role) for jQuery Mobile to show them properly.
   */
  var redlist = $("#r_content").attr('data-role','listview');
  var orangelist = $("#o_content").attr('data-role','listview');
  var bluelist = $("#b_content").attr('data-role','listview');
  var greenlist = $("#g_content").attr('data-role','listview');
  var commuterlist = $("#c_content").attr('data-role','listview');
  
  // For each array of stations (per line) populate the sublists with stations.
  
  for (i=0; i<red_line.length; i++) {
    redlist.append("<li><a href='#'>" + red_line[i] + "</a></li>");
  }
  $("#r_content").append(redlist);
  
  for (i=0; i<orange_line.length; i++) {
    orangelist.append("<li><a href='#'>" + orange_line[i] + "</a></li>");
  }
  $("#o_content").append(orangelist);
            
  for (i=0; i<blue_line.length; i++) {
    bluelist.append("<li><a href='#'>" + blue_line[i] + "</a></li>");
  }
  $("#b_content").append(bluelist);
            
  for (i=0; i<green_line.length; i++) {
    greenlist.append("<li><a href='#'>" + green_line[i] + "</a></li>");
  }
  $("#g_content").append(greenlist);
            
  for (i=0; i<purple_line.length; i++) {
    commuterlist.append("<li><a href='#'>" + purple_line[i] + "</a></li>");
  }
  $("#c_content").append(commuterlist);

  /*
   * This is needed to take the dynamically-created list and make it
   * into a jQuery Mobile listview.
   */
  $("#r_content").listview('refresh');
  $("#o_content").listview('refresh');
  $("#b_content").listview('refresh');
  $("#g_content").listview('refresh');
  $("#c_content").listview('refresh');
  $("#allSta").listview('refresh');
}