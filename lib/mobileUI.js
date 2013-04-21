/* 
 * Filename: mobileUI.js
 * 
 * Programmer:
 *  Daniel Brook, UMass Lowell Student (daniel_brook@student.uml.edu)
 * 
 * Page updated by Daniel Brook on 2013-04-20 at 1:30 PM
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
  if (masstrac.arrivals.length == 0 && line != "green")
    mt_arrivals.append("<li>No predictable arrivals within 2 hours<br /></li>");
  
  // Loop through the arrivals array and begin appending
  for (var c = 0; c < masstrac.arrivals.length; c++) {
    /*
     * Always bind the Train # with the destination for Commuter Rail Trips
     * to prevent ambiguity (for the Weekend Trips Bug as well as any
     * downtown stations).
     */
    var shortDest = masstrac.arrivals[c].Destination;
    var shortLine = masstrac.arrivals[c].Line;
    
    if (shortLine != "green"  &&
        shortLine != "red"    &&
        shortLine != "blue"   &&
        shortLine != "orange") {
      shortDest += " (# " + masstrac.arrivals[c].TripID + ")";
    }
    
    if (masstrac.arrivals[c].Type == "sch") {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>(" +
                         Math.round( masstrac.arrivals[c].Countdown / 60 ) +
                         " min)" +
                         "</td></tr></table></li></a>");
      
    } else if (masstrac.arrivals[c].Type == "pre") {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>" +
                         Math.round( masstrac.arrivals[c].Countdown / 60 ) +
                         " min" +
                         "</td></tr></table></li></a>");
      
    } else if (masstrac.arrivals[c].Type == "app") {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>" +
                         "APPROACHING" +
                         "</td></tr></table></li></a>");
      
    } else if (masstrac.arrivals[c].Type == "arr") {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>" +
                         "ARRIVING" +
                         "</td></tr></table></li></a>");
      
    } else if (masstrac.arrivals[c].Type == "brd") {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>" +
                         "BOARDING" +
                         "</td></tr></table></li></a>");
      
    } else if (masstrac.arrivals[c].Type == "dep") {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>" +
                         "DEPARTING" +
                         "</td></tr></table></li></a>");
      
    } else if (masstrac.arrivals[c].Type == "del") {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>" +
                         "STOPPED" +
                         "</td></tr></table></li></a>");
      
    } else {
      mt_arrivals.append("<li><a href='mtrip.html?name=" + name +
                         "&line=" + line +
                         "&trip=" + masstrac.arrivals[c].TripID +
                         "' data-ajax='false'><table><tr><td>" +
                         shortDest + 
                         "</td><td>" +
                         "- Unknown -" +
                         "</td></tr></table></li></a>");
    }
  }
  
  // Render the Green Line information (if present)
  if (masstrac.greenLine.b !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.b.West_Term +
                       " / " + masstrac.greenLine.b.East_Term +
                       "<br />( B ) Train Expected Every " +
                       masstrac.greenLine.b.Headway + " min</li>");
  
  if (masstrac.greenLine.c !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.c.West_Term +
                       " / " + masstrac.greenLine.c.East_Term +
                       "<br />( C ) Train Expected Every " +
                       masstrac.greenLine.c.Headway + " min</li>");
  
  if (masstrac.greenLine.d !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.d.West_Term +
                       " / " + masstrac.greenLine.d.East_Term +
                       "<br />( D ) Train Expected Every " +
                       masstrac.greenLine.d.Headway + " min</li>");
  
  if (masstrac.greenLine.e !== undefined)
    mt_arrivals.append("<li>" + masstrac.greenLine.e.West_Term +
                       " / " + masstrac.greenLine.e.East_Term +
                       "<br />( E ) Train Expected Every " +
                       masstrac.greenLine.e.Headway + " min</li>");

  $("#arrivalList").append( mt_arrivals );
  
  // Because jQM is silly, update the widget so it's a proper list
  $("#arrivalList").listview( 'refresh' );
  
  // Provide feedback on the last update time.
  $("#timeZone").html( "Updated: " + jGetAMPMTime( new Date(), true, false ) );

}


/*
 * Loads the trip information into the mtrip page in a very similar manner
 * as the function above. 
 * 
 * The name parameter really isn't used, but it's how the underlying
 * functions load the arrival data, so it's a necessity.
 */
function loadTrip( name, line, tripID )
{
  // Some of this code is repeated from above
  $("#timeZone").html( "Fetching new data..." );
  masstrac.dumpData();
  $("#tripList").empty();
  try {
    if (line == "red" || line == "orange" || line == "blue") {
      if (masstrac.getSubway( name, line ) == false) {
        $("#timeZone").html("Problem with Subway Data (try refreshing)");
      }
    } else if (line == "green") {
      // DO NOTHING
    } else {
      if (masstrac.getCommuterRail( name, line ) == false) {
        $("#timeZone").html("Problem with Commuter Rail Data (try refreshing)");
      }
    }
  } catch (e) {
    $("#timeZone").html( "General Data Access Error (try refreshing)" );
  }
  
  // Find the requested TripID and prep it for entry into the tripList <ul>
  for (var i = 0; i < masstrac.trips.length; ++i) {
    if (masstrac.trips[i].TripID == tripID) {
      for (var j = 0; j < masstrac.trips[i].Predictions.length; ++j) {
        $("#tripList").append( "<li><table><tr><td>" +
                               masstrac.trips[i].Predictions[j].Station +
                               "</td><td>" +
                               jGetAMPMTime( new Date(masstrac.trips[i].Predictions[j].UNIXtime * 1000), false, false ) +
// Showing the countdown times is too "noisy" so I took it out.
//                               " (" + 
//                               Math.round( masstrac.trips[i].Predictions[j].Countdown / 60 ) +
//                               " min)" +
                               "</td></tr></table></li>" );
      }
    }
  }
  
  $("#tripList").listview("refresh");
  $("#timeZone").html( "As of " + jGetAMPMTime( new Date(), true, false ) );
}


/*
 * Checks to see if any alerts are present for the given station / line.
 * Returns the number found and populates the alertsDiv.
 */
function anyAlerts( staObj )
{
  try {
    if (masstrac.getStationAlerts( staObj ) == false) {
      $("#alertLink").html(
        "Feed Not Found"
        );
      return;
    }
  } catch ( e ) {
    $("#alertLink").html(
      "Feed Error"
      );
    return;
  }
  
  // Clear out the DOM with the data
  $("#mAlertsList").empty();
  
  if (masstrac.alerts.length > 0) {
    $("#alertLink").html( masstrac.alerts.length );
    
    // Loop through and populate the alerts that were found
    for (var c = 0; c < masstrac.alerts.length; ++c) {
      $("#mAlertsList").append( "<li><h3>" + masstrac.alerts[c].title +
                                "</h3><br />" + masstrac.alerts[c].content +
                                "</li>" );
    }
    
  } else {
    $("#alertLink").html( "None" );
  }
  
  $("#mAlertsList").listview( "refresh" );
}
