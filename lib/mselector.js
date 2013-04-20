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

/*
 * Copies the entire masstrac stations list to add elements to the filter
 * selection list view on the mselectindex page.
 */
function populateAllStations()
{
  var tstations = new Array();
  
  for (var c = 0; c < masstrac.stations.length; ++c) {
    tstations.push( masstrac.stations[c].name );
  }
  
  tstations.sort();
  
  for (c = 0; c < tstations.length; ++c) {
    $("#allStaNames").append( "<li><a href='marrival.html?name=" + tstations[c] +
                        "' data-ajax='false'>" + tstations[c] + "</a></li>" );
  }
  
  $("#allStaNames").listview( "refresh" );
}


/*
 * Loads the stations from the masstrac station list for the specified line
 */
function loadLineStops( mtLineName )
{
  var i, j;
  var stops = new Array();
  
  for (i=0; i<masstrac.stations.length; i++) {
    for (j=0; j<masstrac.stations[i].svcs.length; j++) {
      if (masstrac.stations[i].svcs[j] == mtLineName) {
        stops.push(masstrac.stations[i].name);
      }
    }
  }
  
  // Now make these all alphabetized for easier navigation
  stops.sort();
  
  for (i = 0; i < stops.length; i++)
    $("#lineSta").append("<li><a href='marrival.html?name=" + stops[i] +
                         "&line=" + mtLineName + "' data-ajax='false'>" +
                         stops[i] + "</a></li>");
  
  // Refresh the contents to make jQuery Mobile re-render to its specifications
  $("#lineSta").listview('refresh');
}
