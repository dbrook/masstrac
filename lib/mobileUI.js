/* 
 * Filename: mobileUI.js
 * 
 * Programmers:
 *  Jivani Cassar, UMass Lowell Student (jivani_cassar@student.uml.edu)
 *  Daniel Brook, UMass Lowell Student (daniel_brook@student.uml.edu)
 * 
 * Page updated by Daniel Brook on 2013-03-30 at 12:00 PM
 * 
 * This file contains the JavaScript code to populate arrival times into the
 * mobile arrivals page.
 */

/*
 * The reloadData function is the primary gateway to requesting the arrival
 * times. This will determine which arrivals should load (Commuter Rail or
 * Subway) as well as render them onto the page.
 * 
 * In addition, the alerts feed will also be fetched.
 */
function reloadData( name, line )
{
  // Tell user that an update is occurring
  $("#timeZone").html( "Fetching new data..." );
  
  // Dump existing data first (as required by the API)
  masstrac.dumpData();
  
  /*
   * Using the provided station and line, attempt a lookup.
   * 
   * This is wrapped in an exception in the event that the masstrac code
   * encounters a problem it cannot gracefully return from.
   * 
   * The subway and commuter rail data are different, so different functions
   * are used to make life easier.
   */
  //alert( "Line is: " + line + " and Station is: " + name );
  try {
    if (line == "red" || line == "orange" || line == "blue") {
      if (masstrac.getSubway( name, line ) == false) {
        
        // Error handling (from a graceful error from getSubway)
        $("#timeZone").html( "Problem with Subway Data (try reloading)" );
        
      }
    } else {
      if (masstrac.getCommuterRail( name, line ) == false) {
        
        // Error handling (from a graceful error from getCommuterRail)
        $("#timeZone").html( "Problem with Commuter Rail Data (try reloading)" );
        
      }
    }
  } catch (e) {
    
    // Do error handling from an unhandled exception.
    $("#timeZone").html( "General Data Access Error (try reloading)" );
  }
  
  // Sort by arrival time because it's easiest to loop through that simple structure
  masstrac.sortArrivals( "time" );
  
  // Fetch the DOM element so we can start appending arrivals to it.
  var mt_arrivals = $("#arrivalList");
  
  // Get rid of the cruft from the last reload. It's not enough to just dumpData
  // because of how this page uses jQuery and the DOM will get progressively filled.
  $("#arrivalList").empty();
  
  // Make it so the user sees a message that there are no available arrivals
  // if there are no available arrivals.
  if (masstrac.arrivals.length == 0)
    mt_arrivals.append("<li>There are no arrivals available</li>");
  
  // Loop through the arrivals array and begin appending
  for (var c = 0; c < masstrac.arrivals.length; c++) {
    
    if (masstrac.arrivals[c].Type == "sch") {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />" +
                         Math.round( masstrac.arrivals[c].Countdown / 60 ) +
                         " min (Scheduled)</li>");
      
    } else if (masstrac.arrivals[c].Type == "pre") {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />" +
                         Math.round( masstrac.arrivals[c].Countdown / 60 ) +
                         " min (Operating)</li>");
      
    } else if (masstrac.arrivals[c].Type == "app") {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />Train Approaching</li>");
      
    } else if (masstrac.arrivals[c].Type == "arr") {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />Train Arriving</li>");
      
    } else if (masstrac.arrivals[c].Type == "brd") {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />-- Boarding --</li>");
      
    } else if (masstrac.arrivals[c].Type == "dep") {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />-- Departing --</li>");
      
    } else if (masstrac.arrivals[c].Type == "del") {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />Train is delayed and not moving</li>");
      
    } else {
      mt_arrivals.append("<li>" + masstrac.arrivals[c].Destination + "<br />-- Status Unknown --</li>");
      
    }
  }
  
  $("#arrivalList").append( mt_arrivals );
  
  // Because jQM is silly, update the widget so it's a proper list
  $("#arrivalList").listview( 'refresh' );
  
  // Provide feedback on the last update time.
  $("#timeZone").html( "Updated: " + jGetAMPMTime( new Date(), true, false ) );

}
