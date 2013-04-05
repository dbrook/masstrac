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
        $("#timeZone").html( "Problem with Subway Data (try refreshing)" );
      }
      
    } else if (line == "green") {
      
      // Fetch Green Line Headway Data
      masstrac.getGreen( name );
      
    } else {
      if (masstrac.getCommuterRail( name, line ) == false) {
        
        // Error handling (from a graceful error from getCommuterRail)
        $("#timeZone").html( "Problem with Commuter Rail Data (try refreshing)" );
        
      }
    }
  } catch (e) {
    
    // Do error handling from an unhandled exception.
    $("#timeZone").html( "General Data Access Error (try refreshing)" );
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
    mt_arrivals.append("<li>* No relevant trips in the data feed. *</li>");
  
  // Loop through the arrivals array and begin appending
  for (var c = 0; c < masstrac.arrivals.length; c++) {
    
    if (masstrac.arrivals[c].Type == "sch") {
      mt_arrivals.append("<li>Train to " + masstrac.arrivals[c].Destination + " in " +
                         Math.round( masstrac.arrivals[c].Countdown / 60 ) +
                         " min (Scheduled)</li>");
      
    } else if (masstrac.arrivals[c].Type == "pre") {
      mt_arrivals.append("<li>Train to " + masstrac.arrivals[c].Destination + " in " +
                         Math.round( masstrac.arrivals[c].Countdown / 60 ) +
                         " min</li>");
      
    } else if (masstrac.arrivals[c].Type == "app") {
      mt_arrivals.append("<li>Train to " + masstrac.arrivals[c].Destination +
                         " is approaching</li>");
      
    } else if (masstrac.arrivals[c].Type == "arr") {
      mt_arrivals.append("<li>Train to " + masstrac.arrivals[c].Destination +
                         " is arriving</li>");
      
    } else if (masstrac.arrivals[c].Type == "brd") {
      mt_arrivals.append("<li>Train to " + masstrac.arrivals[c].Destination +
                         " is NOW BOARDING</li>");
      
    } else if (masstrac.arrivals[c].Type == "dep") {
      mt_arrivals.append("<li>Train to  " + masstrac.arrivals[c].Destination +
                         " is DEPARTING</li>");
      
    } else if (masstrac.arrivals[c].Type == "del") {
      mt_arrivals.append("<li>Train to " + masstrac.arrivals[c].Destination +
                         " is delayed and not moving</li>");
      
    } else {
      mt_arrivals.append("<li>Destination: " + masstrac.arrivals[c].Destination +
                         "<br />-- Status Unknown --</li>");
    }
  }
  
  // Render the Green Line information (if present)
  if (masstrac.greenLine.b !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.b.West_Term +
                       " / " + masstrac.greenLine.b.East_Term +
                       "<br />(B) Train Expected Every " +
                       masstrac.greenLine.b.Headway + " min</li>");
  
  if (masstrac.greenLine.c !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.c.West_Term +
                       " / " + masstrac.greenLine.c.East_Term +
                       "<br />(C) Train Expected Every " +
                       masstrac.greenLine.c.Headway + " min</li>");
  
  if (masstrac.greenLine.d !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.d.West_Term +
                       " / " + masstrac.greenLine.d.East_Term +
                       "<br />(D) Train Expected Every " +
                       masstrac.greenLine.d.Headway + " min</li>");
  
  if (masstrac.greenLine.e !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.e.West_Term +
                       " / " + masstrac.greenLine.e.East_Term +
                       "<br />(E) Train Expected Every " +
                       masstrac.greenLine.e.Headway + " min</li>");

  $("#arrivalList").append( mt_arrivals );
  
  // Because jQM is silly, update the widget so it's a proper list
  $("#arrivalList").listview( 'refresh' );
  
  // Provide feedback on the last update time.
  $("#timeZone").html( "Updated: " + jGetAMPMTime( new Date(), true, false ) );

}
