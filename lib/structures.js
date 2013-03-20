/* 
 * Filename: structures.js
 * 
 * Programmer: Daniel Brook, daniel_brook@student.uml.edu
 *             UMass Lowell Student
 * 
 * This file is part of a project for 91.462 - GUI Programming 2
 * 
 * This file contains the initializations for the global data structures
 * which will be populated by the datagetter.js functions. These should only
 * be modified by the datagetter.js functions only.
 */

// All the structures and functions will exist under the masstrac namespace
var masstrac = new Object();


/* 
 * The contents of the line array will be organized by which transit line
 * the information contained within is for. For example:
 * masstrac.arrivals[0] for, say, Park Street, could have:
 *     "Line"        : "red",
 *     "TripID"      : "R982ECD95",
 *     "Destination" : "Braintree",
 *     "Note"        : "Big Red",
 *     "Type"        : "pre",
 *     "Countdown"   : 5,
 *     "UNIXtime"    : 1360083280,
 *     "lat"         : 42.3191,
 *     "lon"         : -71.0686
 * 
 * NOTE: lat and lon will only exist for trains with predictions.
 */
masstrac.arrivals = new Array();


/*
 * This is simply the sorted-by-destination version of masstrac.arrivals.
 * Each trip is placed into the structure based on its line and destination.
 * 
 * This structure is populated instead of masstrac.arrivals when sort-by-dest
 * is requested of the masstrac.sortArrivals( "dest" ) function is called.
 * 
 * It's broken down like so:
 *   masstrac.arrSorted.red
 *                            .a   // Ashmont trips
 *                            .b   // Braintree trips
 *                            .c   // Alewife trips
 *                     .orange
 *                            .f   // Forest Hills trips
 *                            .o   // Oak Grove trips
 *                     .blue
 *                            .b   // Bowdoin trips
 *                            .w   // Wonderland trips
 *                     .cr
 *                            .inb // Inbound trips (North/South Station)
 *                            .out // Outbound trips (Everything else)
 * 
 * Each of the above arrays (like masstrac.arrSorted.red.b) will contain the
 * exact same structure as the array entries of masstrac.arrivals[].
 * 
 * This isn't exactly very future proof, especially if any lines are ever
 * expanded, the underlying datagetter.js will need to be reworked to properly
 * sort the new arrivals. This structure also will not contain subway trips 
 * with different destinations (although in my experience with the data thus
 * far, the destinations have never been different than the terminal stations).
 */
masstrac.arrSorted = new Object();

/* 
 * As detailed everywhere, the green line is a big mess signaling-wise, so
 * no predictions are available. As such, the data structures for the line
 * with predictions enabled are useless, so this simpler Green Line strucutre
 * is used as a stop-gap until predictions are available.
 * 
 * Example structure:
 * masstrac.greenLine[0] for North Station could look like:
 *     "Destination" : "Heath Street (E)",
 *     "Frequency"   : 11
 * 
 * This structure will be populated from the datagetter.js file using the
 * green.json structure's information, so be sure to include that first.
 */
masstrac.greenLine = new Array();

/*
 * The trips array will hold information about all the trips from the JSON
 * structure retrieved for a particular line. It's a simple array which
 * looks like so:
 * masstrac.trips[0] for Downtown Crossing could look like:
 *     "TripID" : "O985F6F12",
 *     predictions[0]
 *          "station"   : "Jackson Square",
 *          "countdown" : 5
 *     predictions[1]
 *          "station"   : "Stony Brook",
 *          "countdown" : 9
 *     ...
 */
masstrac.trips = new Array();

/* 
 * The alerts array is a very simple structure that will get populated by
 * datagetter.js. It will contain ONLY alerts that are pertinent to the
 * station displayed (including station-specific alerts and entire-line
 * alerts.) For example, an alert for the Red Line would show up at Park 
 * Street, as would a broken elevator at Park Street.
 * Example entry within alerts:
 * masstrac.alerts[0]
 *          "title"   : "Park Street (808) lobby to Red Line center platform",
 *          "content" : "Park Street Elevator 808 is out of service. To ..."
 */
masstrac.alerts = new Array();

