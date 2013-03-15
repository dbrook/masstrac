/* 
 * Filename: datagetter.js
 * 
 * Programmer: Daniel Brook, daniel_brook@student.uml.edu
 *             UMass Lowell Student
 * 
 * This file is part of a project for 91.462 - GUI Programming 2
 * 
 * Page updated by Daniel Brook on 2013-03-13 at 4:50 PM
 * 
 * This file contains the JavaScript code to make the transit tracker display
 * data appropriately show arrival time estimates for Subway and Commuter Rail
 * services. Due to the current lack of Green Line prediction capabilities, we
 * are rolling our own headway display as well. 
 * 
 * Subway and Commuter Rail predictions must be done in separate functions
 * due to the fact that their respective data files are very different and 
 * require separate approaches to processing. However, the front-end shouldn't
 * have to worry about these differences, so a unified globally-accessible 
 * data structure is being implemented (called "lines").
 * 
 * The data for each "trip" is also made available in a globally-accessible
 * data structure called "trips", which is just a simple array with the 
 * name of the station and the predicted arrival time at said station for the
 * particular trip.
 */

/*
 * This tool will completely erase the contents of masstrac.arrivals, 
 * masstrac.greenLine, masstrac.trips to make way for refreshed data
 * on a subsequent getCommuterRail, getSubway, or getGreenLine operation.
 */
masstrac.dumpData = function( )
{
    // Clear out the existing array of arrivals
    // JavaScript should garbage collect, so let's try it this way instead
    delete masstrac.arrivals;
    masstrac.arrivals = new Array();
    
    // Now clean out the Green Line headways setup
    delete masstrac.greenLine;
    masstrac.greenLine = new Array();
    
    // The alerts array needs pruning as well (FINALLY! a bug that was
    // caught before committing to the repo... this is a good day)
    delete masstrac.alerts;
    masstrac.alerts = new Array();
    
    // Finally delete the trips 
    delete masstrac.trips;
    masstrac.trips = new Array();
}


/*
 * Provides a lookup mechanism to the masstrac.stations array, returning
 * the object in which the looked-up station was found, to allow easier
 * access to the contents directly.
 * 
 * Example use:
 *   var crntStat = masstrac.lookupStation( "Government Center" );
 * 
 * Would bind masstrac.stations[4] to crntStat, so you could access the
 * contents like so:
 *                            crntStat.name   ==>   "Government Center"
 */
masstrac.lookupStation = function (requestName)
{
    for (var number = 0; number < masstrac.stations.length; number++) {
        if (masstrac.stations[number].name == requestName)
            return masstrac.stations[number];
    }
    return false;
};

/*
 * Process Commuter Rail information for the station passed as an argument.
 * line_name must be one of the Commuter Rail lines as detailed in the 
 * stations.js file, for example:
 *   getCommuterRail( "Shirley", "fitchburg" );
 * 
 * After the call, the masstrac.arrivals array will be populated with
 * the arrival predictions for the user-requested station, and the 
 * masstrac.trips will be populated with every trip from the JSON file.
 * 
 * This function will return false if an error occurred like an invalid station
 * was specified or a network comms problem occurred.
 */
masstrac.getCommuterRail = function( stop_name, line_name )
{

  ////////////////////////////////////////////////////////////////////
  /// WARNING:    This parameter sets a cut-off for ingesting
  ///             predictions. We've found some strange data when
  ///             looking at predictions (mainly during mornings or
  ///             periods of infrequent service) that show trains
  ///             too far in advanve (the MBTA says trains should
  ///             only show up around 2 hours before scheduled), so
  ///             this parameter sets a cutoff where no entries will 
  ///             get added to the array.
  ////////////////////////////////////////////////////////////////////
    
  var cutoffMin = 200;
    
  var lineNum;
    
  // Convert from the silly naming convention I came up with for the C.R. lines
  // into the line numbers that the MBTA assigns per the developer guide.
  switch (line_name) {
    case "fitchburg":
      lineNum = 9;
      break;
	
    case "haverhill":
      lineNum = 11;
      break;
	
    case "prov_stough":
      lineNum = 5;
      break;
	
    case "worcester":
      lineNum = 8;
      break;
	
    case "needham":
      lineNum = 7;
      break;
	
    case "franklin":
      lineNum = 6;
      break;
	
    case "king_plym":
      lineNum = 2;
      break;
	
    case "middleborough":
      lineNum = 3;
      break;
	
    case "greenbush":
      lineNum = 1;
      break;
	
    case "fairmount":
      lineNum = 4;
      break;
	
    case "newb_rock":
      lineNum = 12;
      break;
	
    case "lowell":
      lineNum = 10;
      break;
      
    default:
      // In case of a bad name just quit silently ... user might have 
      // meant to request a subway line.
      return false;
  }
    
  // Construct the resource name from the above-generated numbers:
  var JSONfileName = "data/RailLine_" + lineNum + ".json";
    
  /* 
   * Use our special PHP script to have our server update the JSON 
   * to fetch the new data if the data we've cached is too old. 
   * 
   * Thanks to:
   * http://stackoverflow.com/questions/8271528/using-ajax-to-access-an-external-php-file
   * 
   * We also need to determine if a problem occurred by making a return variable
   * since the PHP executing will almost always return a 200: Success.
   * 
   * See:
   * http://stackoverflow.com/questions/9193153/find-error-php-returns-to-ajax-in-jquery
   * 
   * Now we have the JSON content directly from calling the mbtaJSON php file,
   * rather than having to do subsequent AJAX gets to the cahced directory..
   * After we've been assured the data on hand is current, use jQuery's
   * AJAX tool to grab the (now in the same domain) JSON file that will
   * be used below to populate masstrac.arrivals.
   *
   * UPDATE: 5-Feb-2013
   * The reason this failed was because $.getJSON is by default
   * asynchronous, and the only way to change this is to use $.ajax.
   * http://stackoverflow.com/questions/1231480/how-to-save-the-getjson-returned-value-in-jquery
   * 
   * Also, apparently many browsers will agressively cache JSON
   * files, meaning that on a refresh old data will still display! 
   * So to avoid that, use cache:false.
   * http://www.electrictoolbox.com/jquery-json-ajax-caching/
   */
  var arrivalEntry;
 
  $.ajax({
    cache   : false,
    method  : 'get',
    async   : false,
    dataType: "json",
    url     : 'lib/mbtaJSON.php',
    data    : {
      'line' : lineNum
    },
    success : function (data) {
      arrivalEntry = data;
    },
    error   : function () {
      // Set the false manually in case the PHP script had problems.
      arrivalEntry.success = false;
    }
  });
    
  if (arrivalEntry.success == false)
    return false;
  
  /*
   * Before going any further, we need to check if JFK/UMass was the
   * selected stop and change it to JFK/UMASS for Commuter Rail arrivals.
   * This is the ONLY station (so far) that has this discrepancy.
   */
  if (stop_name == "JFK/UMass") stop_name = "JFK/UMASS";
    
  /*
   * There's a rather silly bug that creeps up in the arrival data from
   * time to time in the C.R. data ... duplicate trips appear! This
   * array is an attempt to solve that problem because the for loop
   * below will look through it EACH time an entry is added to arrivals.
   */
  var usedTrips = new Array();
    
  /*
   * Run through the data and format it the unified data structure.
   * as details in structures.js.
   * 
   * The different "type" values available will change how the times 
   * get calculated (this is reproduced from:
   *                          http://www.mbta.com/uploadedfiles/devguide.pdf
   * 
   * "sch" - Train isn't yet in service but soon will be (they say ~2ish hr)
   * "pre" - Arrival time is predicted based on current train motion
   * "app" - The train is close enough to the station so say "Approaching"
   * "arr" - The train is just about at the station and will take passengers
   * "dep" - Train just left ... this basically means you've missed it
   * "del" - Train in question is not only late, but it's physically stopped
   */
  for (var c = 0; c < arrivalEntry.Messages.length; c++) {
        
  // See if the entry is outside of our earlier-defined cutoff
        
    if ((1 * arrivalEntry.Messages[c][4].Value -
         1 * arrivalEntry.Messages[c][0].Value)   > cutoffMin * 60)
      continue;

    if (arrivalEntry.Messages[c][3].Value == stop_name ) {
            
      /*
       * Check that this go-around isn't a duplicate trip.
       * If it is, there's no reason to add it to the arrivals as it
       * would only serve to confuse the user (not to mention the
       * people trying to debug!)
       */
      var tripIsDuplicate = false;
            
      for (var chkLoop = 0; chkLoop < usedTrips.length; chkLoop++) {
        if (usedTrips[chkLoop] == arrivalEntry.Messages[c][1].Value) {
          tripIsDuplicate = true;
          break;
        }
      }
      if (tripIsDuplicate) {
        continue;
      } else {
        usedTrips.push( arrivalEntry.Messages[c][1].Value );
      }

      // Store the information in the structure as detailed above
      // This is mostly dependent on the "type" / "flag" value from feed
      var detail;
            
      if (arrivalEntry.Messages[c][5].Value == "sch") {
        detail = {
          "Line"        : line_name,
          "TripID"      : arrivalEntry.Messages[c][1].Value,
          "Destination" : arrivalEntry.Messages[c][2].Value,
          "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Scheduled",
          "Type"        : "sch",
          "Countdown"   : (1 * arrivalEntry.Messages[c][4].Value) - 1 * arrivalEntry.Messages[c][0].Value,
          "UNIXtime"    : 1 * arrivalEntry.Messages[c][4].Value,
          "lat"         : "#",
          "lon"         : "#"
        };

      } else if (arrivalEntry.Messages[c][5].Value == "pre") {
        detail = {
          "Line"        : line_name,
          "TripID"      : arrivalEntry.Messages[c][1].Value,
          "Destination" : arrivalEntry.Messages[c][2].Value,
          "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Operating",
          "Type"        : "pre",
          "Countdown"   : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value) -
                           1 * arrivalEntry.Messages[c][0].Value,
          "UNIXtime"    : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value),
          "lat"         : arrivalEntry.Messages[c][7].Value,
          "lon"         : arrivalEntry.Messages[c][8].Value
        };
                
      } else if (arrivalEntry.Messages[c][5].Value == "app") {
        detail = {
          "Line"        : line_name,
          "TripID"      : arrivalEntry.Messages[c][1].Value,
          "Destination" : arrivalEntry.Messages[c][2].Value,
          "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Approaching the Station",
          "Type"        : "app",
          "Countdown"   : 0,         // Force this to be 0 because weird negatives sometimes seem to show up
          "UNIXtime"    : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value),
          "lat"         : arrivalEntry.Messages[c][7].Value,
          "lon"         : arrivalEntry.Messages[c][8].Value
        };
		
      } else if (arrivalEntry.Messages[c][5].Value == "arr") {
        detail = {
          "Line"        : line_name,
          "TripID"      : arrivalEntry.Messages[c][1].Value,
          "Destination" : arrivalEntry.Messages[c][2].Value,
          "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Entering the Station",
          "Type"        : "arr",
          "Countdown"   : 0,         // Force this to be 0 because weird negatives sometimes seem to show up
          "UNIXtime"    : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value),
          "lat"         : arrivalEntry.Messages[c][7].Value,
          "lon"         : arrivalEntry.Messages[c][8].Value
        };
		
      } else if (arrivalEntry.Messages[c][5].Value == "dep") {
        detail = {
          "Line"        : line_name,
          "TripID"      : arrivalEntry.Messages[c][1].Value,
          "Destination" : arrivalEntry.Messages[c][2].Value,
          "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Leaving the Station",
          "Type"        : "dep",
          "Countdown"   : 0,
          "UNIXtime"    : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value),
          "lat"         : arrivalEntry.Messages[c][7].Value,
          "lon"         : arrivalEntry.Messages[c][8].Value
        };
		
      } else if (arrivalEntry.Messages[c][5].Value == "del") {
        detail = {
          "Line"        : line_name,
          "TripID"      : arrivalEntry.Messages[c][1].Value,
          "Destination" : arrivalEntry.Messages[c][2].Value,
          "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Stopped",
          "Type"        : "del",
          "Countdown"   : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value) -
                           1 * arrivalEntry.Messages[c][0].Value,
          "UNIXtime"    : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value),
          "lat"         : arrivalEntry.Messages[c][7].Value,
          "lon"         : arrivalEntry.Messages[c][8].Value
        };
		
      } else {
        detail = {
          "Line"        : line_name,
          "TripID"      : "####",
          "Destination" : "Train",
          "Note"        : "Unrecognized Data Mode",
          "Type"        : "",
          "Countdown"   : "##",
          "UNIXtime"    : "##",
          "lat"         : arrivalEntry.Messages[c][7].Value,
          "lon"         : arrivalEntry.Messages[c][8].Value
        };
      }

      // The MBTA deems lateness less than 5 minutes as basically ON-TIME,
      // so if the lateness exceeds 300 seconds, then say delayed in the note
      if ((1 * arrivalEntry.Messages[c][11].Value) > 300) {
        detail.Note += ", Delayed " + ((1 * arrivalEntry.Messages[c][11].Value) / 60) + " min";
      }
	    
      // Place the matched value into the array
      masstrac.arrivals.push( detail );
    }  // End the if block matching the requested station name
        
        
  } // End the loop through the entire Commuter Rail Line's JSON file
  
  return true;
} // End of function, getCommuterRail( stop_name, line_name )


/*
 * Sorting capabilities are provided as well. The options for sorting are:
 *   "time" - ONLY by expected arrival time (direction ignored)
 *   "dir"  - By direction and then expected arrival time
 */
masstrac.sortArrivals = function( mode )
{
  // What sorting comparison operations do we need?

  // Use an immediate function as discussed in class and here:
  // http://stackoverflow.com/questions/5503900/how-to-sort-an-array-of-objects-with-jquery-or-javascript
  var SortByArrivalTime = function ( a, b ) {
    var aTime = a.Countdown;
    var bTime = b.Countdown;
        
    return ((aTime < bTime) ? -1 : ((aTime > bTime) ? 1 : 0));
  };
    
  switch (mode) {
        
  case "time":
    masstrac.arrivals.sort(SortByArrivalTime);
    break;
        
  case "dir":
    alert( "NOTE: No sorting was done, because stable sorting is NOT common in all browsers." );
    break;
        
  default:
    alert( "Invalid sorting parameter: " + mode );
  }
} // End of function, sortArrivals( mode )


/*
 * Function to retrieve subway predictions for the Orange, Red, and Blue Lines.
 * This works very similarly to the Commuter Rail arrivals populator above,
 * but was separated from that code because the JSON sources are very
 * different. Call this with the name of the station and the name of the
 * subway line, like so:
 * 
 *   getSubway( "Alewife", "red" );
 *   getSubway( "Wonderland", "blue" );
 *   getSubway( "Wellington", "orange" );
 * 
 * Note: the station and line names are important to get right, as they'll
 * be used to actually check against the arrival data JSON object and they
 * follow the criteria detailed in stations.js.
 * 
 * Remember, the Green Line doesn't have tracking data, so calling this
 * looking for Green Line data will be fruitless.
 * 
 * After the call, the masstrac.arrivals[#number] will be populated, as
 * will the masstrac.trips array for all trips on the line processed.
 */
masstrac.getSubway = function ( stop_name, line_name ) {
    
    // Like with C.R. retrieval, make sure the PHP actually did its job, not
    // just a "200 : Success" message.
    var arrivalEntry;
    
    // Call our PHP script via AJAX to see if server's copy needs updating
    // The PHP script now returns the JSON data that it cached / found, so
    // we don't have to have the separate AJAX call anymore.
    $.ajax({
        cache   : false,
        type    : 'GET',
        async   : false,
        dataType: 'json',
        url     : 'lib/mbtaJSON.php',
        data    : {
            'line' : line_name
        },
        success : function (json) {
          arrivalEntry = json;
        },
        error   : function () {
          arrivalEntry.success = false;
        }
    });

    if (arrivalEntry.success == false)
      return false;
    
    // Should everything have gone well, we can now bring in
    // the JSON file to begin processing.
    // Construct the resource name from the above-generated numbers:
/*    var JSONfileName = "data/" + line_name + ".json";
    
    $.ajax({
        cache    : false,        
        async    : false,
        url      : JSONfileName,
        dataType : "json",
        
        success  : function( json ) {
            arrivalEntry = json;
        }
    });
*/    
    // Store copy of the current time for easier use later time
    var currTime = arrivalEntry.TripList.CurrentTime;
    
    /*
     * Now populate our temporary object and begin pushing matches
     * found for the station name.
     */
    for (var c = 0; c < arrivalEntry.TripList.Trips.length; c++) {
        
        // Temporary object to populate masstrac.arrivals array
        var detail;
        
        // Temporary object that will be used to fill masstrac.trips
        // We know the TripID, so place it into our temp object for trips
        var tripsElem = {
            "TripID" : arrivalEntry.TripList.Trips[c].TripID,
            "Predictions" : new Array()
        };
        
        // Inner loop will traverse through each Trip's predictions
        // and check for a matching stop.
        for (var d = 0; d < arrivalEntry.TripList.Trips[c].Predictions.length; d++) {
            
            // Find the entry in the predictions for the station being requested
            if (arrivalEntry.TripList.Trips[c].Predictions[d].Stop == stop_name) {
                
                var stopCountdown = arrivalEntry.TripList.Trips[c].Predictions[d].Seconds;
                
                detail = {
                    "Line" : line_name,
                    "TripID" : arrivalEntry.TripList.Trips[c].TripID,
                    "Destination" : arrivalEntry.TripList.Trips[c].Destination,
//                    "Note" : "",
                    "Note" : "ID: " + arrivalEntry.TripList.Trips[c].TripID,
                    "Countdown" : 1 * stopCountdown,
                    "UNIXtime" : 1 * stopCountdown + 1 * currTime
                }
                
                // Was there a note included from the JSON source? Append it.
                if (arrivalEntry.TripList.Trips[c].Note !== undefined) {
                    detail.Note += " - " + arrivalEntry.TripList.Trips[c].Note;
                }
                
                if (arrivalEntry.TripList.Trips[c].Position === undefined) {
                    /*
                     * If the JSON doesn't have the Position field, then the
                     * information contained in that specific Trip is merely
                     * PREDICTED / scheduled info, so set the flag
                     */
                    detail.Type = "sch";
                    detail.Note += " - Scheduled";
                    detail.lat = "#";
                    detail.lon = "#";
                    
                } else {
                    /*
                     * Otherwise (until proven horribly wrong by way of errors)
                     * we'll assume predictions are there and enter them in.
                     * 
                     * HOWEVER, the MBTA gives a little less information for the
                     * rapid transit lines, so we'll take the liberty of actually
                     * "emulating" the "pre", "app", "arr", "dep" tags.
                     */
                    if (stopCountdown <= 0) {
                        detail.Type = "brd";
//                        detail.Note += " - Boarding";
                    } else if (stopCountdown <= 60) {
                        detail.Type = "arr";
//                        detail.Note += " - Arriving";
                    } else if (stopCountdown <= 120) {
                        detail.Type = "app";
//                        detail.Note += " - Approaching";
                    } else {
                        detail.Type = "pre";
//                        detail.Note += " - Operating";
                    }
                    
                    // Don't forget the published lat/lon!
                    detail.lat = arrivalEntry.TripList.Trips[c].Position.Lat;
                    detail.lon = arrivalEntry.TripList.Trips[c].Position.Long;
                }
                
                masstrac.arrivals.push( detail );

            }  // End main if block that checks for the match
            
            // So, independent checking of the station name match in 
            // the provided predictions, now need to append an entry
            // into the trips[...].predictions[...] array.
            var tripPrediction = {
                "Station" : arrivalEntry.TripList.Trips[c].Predictions[d].Stop,
                "Countdown" : 1 * stopCountdown,
                "UNIXtime" : 1 * stopCountdown + 1 * currTime
            };
            
            tripsElem.Predictions.push( tripPrediction );
        }

        // If there is available lat/lon data, place that in the tripPrediction
        // This was needed to make the canvas display real positions.
        if (arrivalEntry.TripList.Trips[c].Position !== undefined) {
          tripsElem.lat = arrivalEntry.TripList.Trips[c].Position.Lat;
          tripsElem.lon = arrivalEntry.TripList.Trips[c].Position.Long;
          tripsElem.heading = arrivalEntry.TripList.Trips[c].Position.Heading;
        }
        
        // After iterating through each trip's JSON, now add all the
        // new entries into masstrac.trips:
        masstrac.trips.push( tripsElem );
    }
    
    return true;
}; // End of function, masstrac.getSubway( stop_name, line_name)


/*
 * The getArrivals function is an additional abstraction (to simplify) the
 * retrieval of arrival data for each station. It will do the handling of which
 * service to get arrival data for (since the Commuter Rail and Subway 
 * acquisition is so radically different). This should significantly simplify
 * the front-end code.
 * 
 * The function returns false if an error was encountered, like a non-existent
 * line or a network issue.
 */
masstrac.getArrivals = function ( name, service )
{
  switch (service) {
    case "blue":
    case "red":
    case "orange":
      return masstrac.getSubway( name, service );
    
    case "green":
      return masstrac.getGreen( name );
    
    case "fitchburg":
    case "haverhill":
    case "prov_stough":
    case "worcester":
    case "needham":
    case "franklin":
    case "king_plym":
    case "middleborough":
    case "greenbush":
    case "fairmount":
    case "newb_rock":
    case "lowell":
      return masstrac.getCommuterRail( name, service );
    
    /*
     * The arrival boards at North and South Stations have data feeds
     * somewhere, but we haven't found them yet, so just TRUE for now.
     */
    case "n_station":
    case "s_station":
      return true;
    
    default:
      return false;
  }
}


/*
 * The getGreen function works differently from all the prediction-
 * gathering functions used to assemble data. The Green Line lacks any
 * Automatic Train Control / Operation (ATC/ATO), meaning that it
 * cannot be tracked like its heavy-rail brethren. For us, this means
 * we can only produce average expected waiting times based on published
 * schedules. 
 * 
 * To use this function, simply send it the Green Line station name and
 * it will populate masstrac.greenLine like so:
 *    masstrac.greenLine.e = {
 *        West_Term : "Heath Street",
 *        East_Term : "Lechmere",
 *        Headway   : 9
 *    }
 */
masstrac.getGreen = function ( sta_name ) {
    /*
     * Based on the time of day, we can determine the different 
     * schedule mode the system (should be) in. These different
     * modes are detailed in lib/green.js, and will not be
     * further detailed here.
     */
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var date = now.getDate();
    var day = now.getDay();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    
    var Early = new Date( year, month, date, 4, 30 );
    var AMRush = new Date( year, month, date, 6, 30 );
    var Midday = new Date( year, month, date, 9, 00 );
    var PMRush = new Date( year, month, date, 15, 30 );
    var Evening = new Date( year, month, date, 18, 30 );
    var Late = new Date( year, month, date, 20, 00 );
    var End = new Date( year, month, date, 0, 30 );
    
    /*
     * Find the station's number in the array, then we can easily
     * pick the proper mode with little computational overhead
     */
    for (var greenNum = 0;
         greenNum < masstrac.green.Stations.length;
         greenNum++) {
        
        if (masstrac.green.Stations[greenNum].name == sta_name)
            break;
    }
    
    // If the name wasn't matched, return nothing / fail silently
    
    if (greenNum == masstrac.green.Stations.length)
        return;
    
    // Now populate the branch headways as detailed in green.js
    if (now < Early && now > End)
        return;                    // After-hours (so no trains)
    
    var branchNum;
    
    if (day == 0) {
        // Sunday Schedule
        for (branchNum = 0; 
             branchNum < masstrac.green.Stations[greenNum].sunbranch.length;
             branchNum++) {
            
            masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]] = {
                "West_Term" : masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].west_term,
                "East_Term" : masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].east_term
            }
            
            if (now < End) {
                // Deal with the SATURDAY service which will be ending technically
                // very early on SUNDAY morning.
                masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].Early;
                
            } else if (now < AMRush) {
                // Early Morning Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Early;
                
            } else if (now < Midday) {
                // AM Rush Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].AMRush;
                
            } else if (now < PMRush) {
                // Midday Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Midday;
                
            } else if (now < Evening) {
                // PM Rush Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].PMRush;
                
            } else if (now < Late) {
                // Evening Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Evening;
                
            } else {
                // Late Night Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Late;
            }
        }
        
    } else if (day == 6) {
        // Saturday Schedule
        for (branchNum = 0; 
             branchNum < masstrac.green.Stations[greenNum].satbranch.length;
             branchNum++) {
            
            masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]] = {
                "West_Term" : masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].west_term,
                "East_Term" : masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].east_term
            }

            if (now < End) {
                // Deal with the ending FRIDAY NIGHT service,
                // which technically occurs on SATURDAY morning.
                masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Early;
                
            } else if (now < AMRush) {
                // Early Morning Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].Early;
                
            } else if (now < Midday) {
                // AM Rush Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].AMRush;
                
            } else if (now < PMRush) {
                // Midday Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].Midday;
                
            } else if (now < Evening) {
                // PM Rush Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].PMRush;
                
            } else if (now < Late) {
                // Evening Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].Evening;
                
            } else {
                // Late Night Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].satbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Saturday[masstrac.green.Stations[greenNum].satbranch[branchNum]].Late;
            }
        }
        
    } else {
        // Weekday Schedule
        for (branchNum = 0; 
             branchNum < masstrac.green.Stations[greenNum].wkdbranch.length;
             branchNum++) {
            
            masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]] = {
                "West_Term" : masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].west_term,
                "East_Term" : masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].east_term
            }
            
            /*
             * The late night SUNDAY service technically goes into Monday
             * morning, but we won't want to display the Weekday headways,
             * so this first if takes care of that.
             */
            if (day == 1 && now < End) {
                masstrac.greenLine[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Sunday[masstrac.green.Stations[greenNum].sunbranch[branchNum]].Early;
                
            } else if (now < AMRush) {
                // Early Morning Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Early;
                
            } else if (now < Midday) {
                // AM Rush Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].AMRush;
                
            } else if (now < PMRush) {
                // Midday Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Midday;
                
            } else if (now < Evening) {
                // PM Rush Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].PMRush;
                
            } else if (now < Late) {
                // Evening Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Evening;
                
            } else {
                // Late Night Schedule
                masstrac.greenLine[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Headway = 
                    masstrac.green.Headway.Weekdays[masstrac.green.Stations[greenNum].wkdbranch[branchNum]].Late;
            }
        }
    }
    
}; // End of function, masstrac.getGreen( sta_name )


/*
 * This function is designed to ask for the MBTA alerts RSS feed and look
 * through the gathered XML data to find if a service alert or advisory is
 * currently within the feed. 
 * 
 * The function will return a bool, true  - alert feed processed OK
 *                                  false - problem was encountered
 *                                  
 * This operation produces a side-effect of populating the masstrac.alerts 
 * array with the title and description of the alert data like so:
 * 
 * (Example of calling masstrac.getStationAlerts( "Wellington" );)
 *    masstrac.alerts[0] =
 *    {
 *        title   : "Wellington Lobby to Parking Garage",
 *        content : "Elevator from lobby to parking garage is out of service."
 *    }
 */
masstrac.getStationAlerts = function( stationObject )
{
  ///////////////////////////////   WARNING   //////////////////////////////////
  // We'll just have to assume that the station names as created in stations.js
  // match the names the MBTA uses in the data feed. If they don't, then this 
  // will be a serious show-stopper in terms of actually getting alerts to 
  // display in the station page.
  //////////////////////////////////////////////////////////////////////////////
  
  /*
   * The return Boolean will be set false when an error is encountered
   */
  var errflag = true;
  
  /*
   * Call up the PHP back-end to get a fresh RSS feed file (if needed).
   * 
   * We'll save the hassle of getting the RSS feed into the site separately, 
   * instead opting to have our remade PHP script give us the requisite RSS
   * feed (cached or new) directly. (The same change was made to mbtaJSON.php).
   * 
   * When we know it's up to date, use AJAX to construct its DOM tree. In here,
   * we'll use the find function aggressively to check titles for matching
   * station names.
   * 
   * This code is largely based on a blog entry here:
   * http://jquerybyexample.blogspot.com/2012/04/read-and-process-xml-using-jquery-ajax.html
   */
  $.ajax({
    method  : 'get',
    async   : false,
    url     : 'lib/mbtaALERTS.php',
    success : function (xml) {
      
      if (xml == "error") {
        errflag = false;
        return;
      }
      
      /*
       * Now, there's a good deal happening here, but essentially we're just 
       * looping through each <item> element and extracting its <title>, then
       * seeing if the station's name appears int there. If it does, we take
       * that title, and the associated <description>, make it into an object,
       * then append that object to the masstrac.alerts array.
       */
      $(xml).find('item').each( function() {
        
        var strTitle = $(this).find('title').text();
        
        // Do we have a match?
        // (The convention in the RSS feed appears to be that the station names
        // appear first in the title tags ... always)
        
        if (strTitle.substring(0, stationObject.name.length) == stationObject.name) {
          var newAlert = {
            title   : strTitle,
            content : $(this).find('description').text()
          };
          
          masstrac.alerts.push( newAlert );
        }
        
      });
      
      /*
       * Now that alerts specific to the station were appended, see if there
       * are any for the lines that service the station.
       */
      var rssLineName;
      
      for (var line = 0; line < stationObject.svcs.length; line++) {
        switch (stationObject.svcs[line]) {
          case "red":
            rssLineName = "Red Line";
            break;
          case "blue":
            rssLineName = "Blue Line";
            break;
          case "orange":
            rssLineName = "Orange Line";
            break;
          case "green":
            rssLineName = "Green Line";
            break;
          case "prov_stough":
            rssLineName = "Providence/Stoughton";
            break;
          case "fairmount":
            rssLineName = "Fairmount";
            break;
          case "fitchburg":
            rssLineName = "Fitchburg/South Acton";
            break;
          case "worcester":
            rssLineName = "Framingham/Worcester";
            break;
          case "franklin":
            rssLineName = "Franklin/Forge Park";
            break;
          case "haverhill":
            rssLineName = "Haverhill";
            break;
          case "lowell":
            rssLineName = "Lowell";
            break;
          case "middleborough":
            rssLineName = "Middleborough/Lakeville";
            break;
          case "needham":
            rssLineName = "Needham";
            break;
          case "newb_rock":
            rssLineName = "Newburyport/Rockport";
            break;
          case "king_plym":
            rssLineName = "Kingston/Plymouth";
            break;
          case "greenbush":
            rssLineName = "Greenbush";
            break;

          // N_ and S_STATION aren't valid "lines", we use them for a different 
          // purpose altogether (departure boards) so ignore them but DON'T fail
          case "n_station":
          case "s_station":
            errflag = true;
            break;
          default:
            // If no conversion is possible, return error.
            errflag = false;
        }
        
        /*
         * Now try and find / append alerts for each line
         */
        $(xml).find('item').each( function() {

          var strTitle = $(this).find('title').text();

          if (strTitle.substring(0, rssLineName.length) == rssLineName) {
            var newAlert = {
              title   : strTitle,
              content : $(this).find('description').text()
            };
            masstrac.alerts.push( newAlert );
          }
        });
      }
    },
    
    error    : function() {
      errflag = false;
    }
  });
  
  return errflag;
}
