/* 
 * Filename: datagetter.js
 * 
 * Programmer: Daniel Brook, daniel_brook@student.uml.edu
 *             UMass Lowell Student
 * 
 * This file is part of a project for 91.462 - GUI Programming 2
 * 
 * Page updated by Daniel Brook on 2013-04-20 at 10:45 AM
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
 * 
 * This was finally extended to handle Commuter Rail trips going into the
 * masstrac.trips array, as well as subway prediction times for all trips on 
 * the line (not just those which stop at the station being queried).
 * 
 * As of 25-Apr-2013 the Commuter Rail feed has been changed upstream, so 
 * the getCommuterRail function has been updated to reflect this.
 */

/*
 * This function is from Professor Heines' common.js file
 * (See below)
 * pad a string with leading zeros to a specified width
 */
function jLeadingZeroes( nstr, width )
{
  nstr = nstr + "" ;
  while ( nstr.length < width )
    nstr = "0" + nstr ;
  return nstr ;
}

/*
 * This function was taken from Professor Heines' common.js file
 * (available here:
 *  http://abraham.cs.uml.edu/~heines/common.js )
 * 
 * this function returns the current time in HH:MM:SS AM|PM format
 *   date - date object to format
 *   bsec - true if the seconds should be printed with the time
 *   btz  - true if the time zone should also be printed
 */
function jGetAMPMTime( date, bsec, btz ) {
  var strDate = date.toString() ;
  var posLParen, posSpace ;  // positions of left paren and space

  var ampm = " AM" ;
  if ( date.getHours() > 11 ) {
    ampm = " PM" ;
  }

  var strTime = date.getHours() % 12 ;
  if ( strTime == 0 ) {
    strTime = 12 ;
  }

  strTime += ":" + jLeadingZeroes( date.getMinutes(), 2 ) ;
  if ( bsec ) strTime += ":" + jLeadingZeroes( date.getSeconds(), 2 ) ;
  strTime += ampm ;

  // add time zone
  if ( btz ) {
    if ( ( posLParen = strDate.indexOf( "(" ) ) > 0 ) {   // Netscape
      strTime += " " + strDate.substr( posLParen+1, 1 ) ;
      posSpace = strDate.indexOf( " ", posLParen ) ;
      strTime += strDate.substr( posSpace+1, 1 ) ;
      posSpace = strDate.indexOf( " ", posSpace + 1 ) ;
      strTime += strDate.substr( posSpace+1, 1 ) ;
    } else {  // Internet Explorer
      strTime += " " + date.toString().substr( date.toString().length-8, 3 ) ;
    }
  }

  return strTime ;
}


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
    
    // See what these all mean in structures.js
    delete masstrac.arrSorted;
    masstrac.arrSorted              = new Object();
    masstrac.arrSorted.red          = new Object();
    masstrac.arrSorted.red.a        = new Array();
    masstrac.arrSorted.red.b        = new Array();
    masstrac.arrSorted.red.c        = new Array();
    masstrac.arrSorted.red.other    = new Array();
    masstrac.arrSorted.orange       = new Object();
    masstrac.arrSorted.orange.f     = new Array();
    masstrac.arrSorted.orange.o     = new Array();
    masstrac.arrSorted.orange.other = new Array();
    masstrac.arrSorted.blue         = new Object();
    masstrac.arrSorted.blue.b       = new Array();
    masstrac.arrSorted.blue.w       = new Array();
    masstrac.arrSorted.blue.other   = new Array();
    masstrac.arrSorted.cr           = new Object();
    masstrac.arrSorted.cr.inb       = new Array();
    masstrac.arrSorted.cr.out       = new Array();
    
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
 * 
 * This now does a case-insensitive comparison to accomadate "sloppy" seleciton
 */
masstrac.lookupStation = function (requestName)
{
    for (var number = 0; number < masstrac.stations.length; number++) {
        if (masstrac.stations[number].name.toUpperCase() ===
            requestName.toUpperCase())
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
 * 
 * *** This is a nearly-complete rewrite of the old getCommuterRail function,
 * which utilized the old version of the data feed. The discussion on the
 * MassDOT Developers Google Group provides an explanation.
 *        http://groups.google.com/group/massdotdevelopers
 *        
 * The main takeaway is that instead of writing key and value entries in 
 * a nested array structure, the new JSON follows the "JSON way" of doing 
 * things and this completely broke the old code.
 * 
 * This change occurred on 25-Apr-2013
 */
masstrac.getCommuterRail = function( stop_name, line_name )
{
  // Convert from the masstrac internal line codes into the line numbers 
  // that the MBTA assigns per the developer guide.
  var lineNum;
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
   * 
   * Update: 26-Apr-2013
   * Fortunately for us, the URL of the data source didn't change, so the
   * interface to the PHP backend doesn't need any modification at all.
   * 
   * Also now the call can time-out (preventing a forever-blocked browser
   * when a data connection from the client to the PHP gets severed.
   */
  var arrivalEntry = {"success" : false};
 
  $.ajax({
    cache   : false,
    method  : 'get',
    async   : false,
    timeout : 5000,
    dataType: "json",
    url     : 'lib/mbtaJSON.php',
    data    : {
      'line' : lineNum
    },
    success : function (data) {
      arrivalEntry = data;
    },
    error   : function () {
      arrivalEntry.success = false;
    }
  });
    
  if (arrivalEntry.success == false)
    return false;
  
  /*
   * Before going any further, check if JFK/UMass was the
   * selected stop and change it to JFK/UMASS for Commuter Rail arrivals.
   * This is the ONLY station (so far) that has this (strange) discrepancy.
   * (This is still an issue with the new version of the feed)
   */
  if (stop_name == "JFK/UMass") stop_name = "JFK/UMASS";
    
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
  var pred;           // Making references to returned data shorter

  for (var c = 0; c < arrivalEntry.Messages.length; c++) {
    
    pred = arrivalEntry.Messages[c];
    
    if (pred.Stop == stop_name ) {
      
      // Store the information in the structure as detailed above
      // This is mostly dependent on the "type" / "flag" value from feed.
      // This detail variable will basically hold an entry in the arrivals arr.
      var detail;
      
      switch (pred.Flag) {
      case "sch":
        detail = {
          "Line"        : line_name,
          "TripID"      : pred.Trip,
          "Destination" : pred.Destination,
          "Note"        : "Train #" + pred.Trip + " - Scheduled",
          "Type"        : "sch",
          "Countdown"   : 1 * pred.Scheduled - 1 * pred.TimeStamp,
          "UNIXtime"    : 1 * pred.Scheduled,
          "lat"         : "#",
          "lon"         : "#"
        };
        break;
      
      case "pre":
        detail = {
          "Line"        : line_name,
          "TripID"      : pred.Trip,
          "Destination" : pred.Destination,
          "Note"        : "Train #" + pred.Trip,
          "Type"        : "pre",
          "Countdown"   : (1 * pred.Scheduled + 1 * pred.Lateness) - 1 * pred.TimeStamp,
          "UNIXtime"    : (1 * pred.Scheduled + 1 * pred.Lateness),
          "lat"         : pred.Latitude,
          "lon"         : pred.Longitude
        };
        break;
                
      case "app":
        detail = {
          "Line"        : line_name,
          "TripID"      : pred.Trip,
          "Destination" : pred.Destination,
          "Note"        : "Train #" + pred.Trip + " - Approaching the station",
          "Type"        : "app",
          "Countdown"   : 0,      // Forced to avoid the negative times
          "UNIXtime"    : (1 * pred.Scheduled + 1 * pred.Lateness),
          "lat"         : pred.Latitude,
          "lon"         : pred.Longitude
        };
        break;
        
      case "arr":
        detail = {
          "Line"        : line_name,
          "TripID"      : pred.Trip,
          "Destination" : pred.Destination,
          "Note"        : "Train #" + pred.Trip + " - Entering the station",
          "Type"        : "arr",
          "Countdown"   : 0,      // Forced to avoid the negative times
          "UNIXtime"    : (1 * pred.Scheduled + 1 * pred.Lateness),
          "lat"         : pred.Latitude,
          "lon"         : pred.Longitude
        };
        break;
		
      case "dep":
        detail = {
          "Line"        : line_name,
          "TripID"      : pred.Trip,
          "Destination" : pred.Destination,
          "Note"        : "Train #" + pred.Trip + " - Leaving the Station",
          "Type"        : "dep",
          "Countdown"   : 0,      // Forced to avoid the negative times
          "UNIXtime"    : (1 * pred.Scheduled + 1 * pred.Lateness),
          "lat"         : pred.Latitude,
          "lon"         : pred.Longitude
        };
        break;
		
      case "del":
        detail = {
          "Line"        : line_name,
          "TripID"      : pred.Trip,
          "Destination" : pred.Destination,
          "Note"        : "Train #" + pred.Trip + " - Stopped",
          "Type"        : "del",
          "Countdown"   : (1 * pred.Scheduled + 1 * pred.Lateness) - 1 * pred.TimeStamp,
          "UNIXtime"    : (1 * pred.Scheduled + 1 * pred.Lateness),
          "lat"         : pred.Latitude,
          "lon"         : pred.Longitude
        };
        break;
		
      default:
        detail = {
          "Line"        : line_name,
          "TripID"      : "####",
          "Destination" : "Train",
          "Note"        : "Unrecognized Data Mode",
          "Type"        : "",
          "Countdown"   : "##",
          "UNIXtime"    : "##",
          "lat"         : pred.Latitude,
          "lon"         : pred.Longitude
        };
      }

      // The MBTA deems lateness less than 5 minutes as basically ON-TIME,
      // so if the lateness exceeds 300 seconds, then say delayed in the note
      if ((1 * pred.Lateness) > 250) {
        detail.Note += ", Delayed " + ((1 * pred.Lateness) / 60) + " min";
      }
	    
      // Place the matched value into the array
      masstrac.arrivals.push( detail );

    }  // End the if block matching the requested station name
    
    /*
     * Regardless of the station name match, we want to put ALL the data from
     * the JSON into the separate trips array (so clients can see everything
     * on the line, not just what's arriving at the selected station.
     * 
     * This is done by checking the entire trips array already in memory and
     * seeing if the trip associated with this arrival entry is already there.
     * If it's not, then it's the first entry of its kind there, so insert the
     * entire contents needed.
     */
    for (var d = 0; d < masstrac.trips.length; ++d) {
      if (pred.Trip == masstrac.trips[d].TripID) {
        var arrvObj = {
          "Station" : pred.Stop,
          "Countdown" : (1 * pred.Scheduled + 1 * pred.Lateness) - 1 * pred.TimeStamp,
          "UNIXtime" : (1 * pred.Scheduled + 1 * pred.Lateness)
        };
        masstrac.trips[d].Predictions.push( arrvObj );
        break;
      }
    }
    
    // If it doesn't, then one has to be made manually
    if (d == masstrac.trips.length) {
      var tripObj = {
        "TripID" : pred.Trip,
        "Destination" : pred.Destination,
        "Note"        : "",
        "Predictions" : [{
          "Station" : pred.Stop,
          "Countdown" : (1 * pred.Scheduled + 1 * pred.Lateness) - 1 * pred.TimeStamp,
          "UNIXtime" : (1 * pred.Scheduled + 1 * pred.Lateness)
        }]
      };
      
      // Append lateness information to trip
      if ((1 * pred.Lateness) > 250) {
        tripObj.Note += "Delayed " + ((1 * pred.Lateness) / 60) + " min";
      }
      
      masstrac.trips.push( tripObj );
    }
  } // End the loop through the entire Commuter Rail Line's JSON file
  
  return true;
} // End of function, getCommuterRail( stop_name, line_name )


/*
 * Sorting capabilities are provided as well. The options for sorting are:
 *   "time" - ONLY by expected arrival time (direction ignored)
 *   "dest" - By destination and then expected arrival time
 * 
 * If you've sorted by time, then you'll need to use masstrac.arrivals[], if
 * you've sorted by destination/line then you'll need to get the arrivals from
 * the masstrac.arrSorted structure instead.
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
    delete masstrac.arrSorted;                 // Don't need for time-only sort
    break;
        
  case "dest":
    // Do a time-based sort first, so elements appear in their respective
    // "queues" by their predicted arrival time.
    masstrac.arrivals.sort(SortByArrivalTime);
    
    /*
     * For each element in arrivals, determine the appropriate line/dest
     * to place it into arrSorted.
     * 
     * If there are any trips that don't have an expected destination (like
     * the terminal "Forest Hills", then it's pushed into the *.other array).
     */
    for (var entry = 0; entry < masstrac.arrivals.length; entry++) {
      
      var arrObj = masstrac.arrivals[entry];
      
      switch (arrObj.Line) {
        // SUBWAY TRIPS
        case "red":
          if (arrObj.Destination == "Ashmont")
            masstrac.arrSorted.red.a.push( arrObj );
          else if (arrObj.Destination == "Braintree")
            masstrac.arrSorted.red.b.push( arrObj );
          else if (arrObj.Destination == "Alewife")
            masstrac.arrSorted.red.c.push( arrObj );
          else
            masstrac.arrSorted.red.other.push( arrObj );
        break;
          
        case "orange":
          if (arrObj.Destination == "Oak Grove")
            masstrac.arrSorted.orange.o.push( arrObj );
          else if (arrObj.Destination == "Forest Hills")
            masstrac.arrSorted.orange.f.push( arrObj );
          else
            masstrac.arrSorted.orange.other.push( arrObj );
          break;
          
        case "blue":
          if (arrObj.Destination == "Bowdoin")
            masstrac.arrSorted.blue.b.push( arrObj );
          else if (arrObj.Destination == "Wonderland")
            masstrac.arrSorted.blue.w.push( arrObj );
          else
            masstrac.arrSorted.blue.other.push( arrObj );
          break;
        
        // COMMUTER RAIL TRIPS
        case "fitchburg":
        case "lowell":
        case "prov_stough":
        case "newb_rock":
        case "greenbush":
        case "king_plym":
        case "middleborough":
        case "haverhill":
        case "worcester":
        case "needham":
        case "fairmount":
        case "franklin":
          if (arrObj.Destination == "North Station" ||
              arrObj.Destination == "South Station")
            masstrac.arrSorted.cr.inb.push( arrObj );
          else
            masstrac.arrSorted.cr.out.push( arrObj );
          break;
          
        default:
          break;   // Again, do nothing with weird trip data.
      }
    }
    
    // Each Line has been isolated. No longer need the original array.
    delete masstrac.arrivals;
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
    var arrivalEntry = {"success" : false};
    
    // Call our PHP script via AJAX to see if server's copy needs updating
    // The PHP script now returns the JSON data that it cached / found, so
    // we don't have to have the separate AJAX call anymore.
    // This now also handles time-outs (see the getCommuterRail function)
    $.ajax({
        cache   : false,
        type    : 'GET',
        async   : false,
        timeout : 5000,
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

    // Store copy of the current time for easier use at a later time
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
            "Destination" : arrivalEntry.TripList.Trips[c].Destination,
            "Note" : (arrivalEntry.TripList.Trips[c].Note === undefined)
                      ? "" : arrivalEntry.TripList.Trips[c].Note,
            "Predictions" : new Array()
        };
        
        // Inner loop will traverse through each Trip's predictions
        // and check for a matching stop.
        for (var d = 0; d < arrivalEntry.TripList.Trips[c].Predictions.length; d++) {
            
            // Need to extract some parameters from the JSON before the 
            // condition is checked, otherwise many parameters don't make it
            // into masstrac.trips!
            var stopCountdown = arrivalEntry.TripList.Trips[c].Predictions[d].Seconds;
            
            // Find the entry in the predictions for the station being requested
            if (arrivalEntry.TripList.Trips[c].Predictions[d].Stop == stop_name) {
                
                detail = {
                    "Line" : line_name,
                    "TripID" : arrivalEntry.TripList.Trips[c].TripID,
                    "Destination" : arrivalEntry.TripList.Trips[c].Destination,
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
                  
                } else if (stop_name == "Forest Hills" &&
                           detail.Destination != "Forest Hills" ||
                           stop_name == "Oak Grove" &&
                           detail.Destination != "Oak Grove" ||
                           stop_name == "Ashmont" &&
                           detail.Destination != "Ashmont" ||
                           stop_name == "Alewife" &&
                           detail.Destination != "Alewife" ||
                           stop_name == "Braintree" &&
                           detail.Destination != "Braintree" ||
                           stop_name == "Bowdoin" &&
                           detail.Destination != "Bowdoin" ||
                           stop_name == "Wonderland" &&
                           detail.Destination != "Wonderland"    ) {
                  /*
                   * This group is for terminal stations, where the trains will
                   * be berthed and accepting passengers. Basically, don't
                   * store the different flags like brd, arr for the inbound-
                   * facing trips because they don't make sense in the scope of
                   * a terminal station.
                   */
                  
                  // Is the inbound trip about to leave? Put a "dep" flag on it
                  // instead of just calling it predicted.
                  if (detail.Countdown <= 30) {
                    detail.Type = "dep";
                  } else {
                    detail.Type = "pre";
                  }
                  
                } else {
                    /*
                     * Otherwise assume predictions are there and enter them in
                     * 
                     * HOWEVER, the MBTA gives a little less information for the
                     * rapid transit lines, so we'll take the liberty of actually
                     * "emulating" the "pre", "app", "arr", "dep" tags.
                     */
                    if (stopCountdown <= 0) {
                        detail.Type = "brd";
                    } else if (stopCountdown <= 60) {
                        detail.Type = "arr";
                    } else if (stopCountdown <= 120) {
                        detail.Type = "app";
                    } else {
                        detail.Type = "pre";
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
