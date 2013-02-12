/* 
 * Filename: datagetter.js
 * 
 * Programmer: Daniel Brook, daniel_brook@student.uml.edu
 *             UMass Lowell Student
 * 
 * This file is part of a project for 91.462 - GUI Programming 2
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
 */

/*
 * Process Commuter Rail information for the station passed as an argument.
 * line_name must be one of the Commuter Rail lines as detailed in the 
 * stations.js file, for example:
 *   getCommuterRail( "Shirley", "fitchburg" );
 * 
 * After the call, the masstrac.arrivals[#number]
 */
masstrac.getCommuterRail = function( stop_name, line_name )
{
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
	return;
    }
    
    // Construct the resource name from the above-generated numbers:
    var JSONfileName = "data/RailLine_" + lineNum + ".json";
    
    /* 
     * Here's (a | the) fun part. Eventually we'll need to use an AJAX
     * command to get our simple PHP backend to fetch the new data if the
     * data we've cached on the server is too old. 
     * Thanks to:
     * http://stackoverflow.com/questions/8271528/using-ajax-to-access-an-external-php-file
     */
    $.ajax({
        method  : 'get',
        async   : false,
        url     : 'lib/mbtaJSON.php',
        data    : {
            'line' : lineNum
        },
        error   : function (data) {
            alert( "There's a problem in the PHP script. The data you'll see might be wrong." );
        }
    });
    
    /* 
     * After we've been assured the data on hand is current, use jQuery's
     * AJAX tool to grab the (now in the same domain) JSON file that will
     * be used below to populate the "arrivals" global array. The locally-
     * scoped variable we'll use to do this is called "arrivalEntry"
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
        cache    : false,        
        async    : false,
        url      : JSONfileName,
        dataType : "json",
        
        /*
         * The success callback (we'll just slap it in here)...
         * Basically, we're making a big old copy of the JSON data for
         * the browser to process with the subsequent JavaScript code.
         */
        success  : function( json ) {
            arrivalEntry = json;
        }
    });
    
    /*
     * Before going any further, we need to check if JFK/UMass was the
     * selected stop and change it to JFK/UMASS for Commuter Rail arrivals.
     * This is the ONLY station (so far) that has this dichotomy.
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
    for (var c = 0; c < arrivalEntry.Messages.length; c++) {
	if (arrivalEntry.Messages[c][3].Value == stop_name ) {
	    
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
		    "Countdown"   : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value) - 1 * arrivalEntry.Messages[c][0].Value,
                    "UNIXtime"    : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value),
                    "lat"         : arrivalEntry.Messages[c][7].Value,
                    "lon"         : arrivalEntry.Messages[c][8].Value
		};
                
	    } else if (arrivalEntry.Messages[c][5].Value == "app") {
		detail = {
                    "Line"        : line_name,
                    "TripID"      : arrivalEntry.Messages[c][1].Value,
		    "Destination" : arrivalEntry.Messages[c][2].Value,
		    "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Operating",
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
		    "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Operating",
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
		    "Note"        : "Train #" + arrivalEntry.Messages[c][1].Value + " - Operating",
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
		    "Countdown"   : (1 * arrivalEntry.Messages[c][4].Value + 1 * arrivalEntry.Messages[c][11].Value) - 1 * arrivalEntry.Messages[c][0].Value,
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
	}
    }
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
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
