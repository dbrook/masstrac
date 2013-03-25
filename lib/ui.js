/* 
 * Filename: ui.js
 * 
 * Programmers:
 * Daniel Brook, UMass Lowell Student, daniel_brook@student.uml.edu
 * Austin Veino, UMass Lowell Student, austin_veino@student.uml.edu
 * Jivani Cassar, UMass Lowell Student, jivani_cassar@student.uml.edu
 * 
 * Page updated by Daniel Brook on 2013-03-25 at 10:50 AM
 * 
 * This file contains the user-facing display functions that will 
 * populate the contents of arrivals.html.
 */

/*
 * Makes the title area with clickable toggles to turn lines on and off
 */
function makeTitle ( stationObject )
{
  var content = "<div id='lineList'><ul>";
  
  /*
   * Do we have any bus connections? Show the icon!
   */
  if (stationObject.bus.length > 0)
    content += "<li><img src='img/bus.png' width='50' height='50' title='Buses Available'></li>";
  
  for (var serv = 0; serv < stationObject.svcs.length; serv++) {
    
    // NOTE: This relies on the images being named the same way that the
    //       services are. See stations.js for this naming scheme.
    
    content += "<li><img src='img/lines/" + stationObject.svcs[serv] +
               "' width=50 height=50 ";
    
    switch (stationObject.svcs[serv]) {
      case "green":
        content += "title='Green Line'";
        break;
      case "red":
        content += "title='Red Line'";
        break;
      case "blue":
        content += "title='Blue Line'";
        break;
      case "orange":
        content += "title='Orange Line'";
        break;
      case "greenbush":
        content += " title='Greenbush Line'";
        break;
      case "fitchburg":
        content += " title='Fitchburg / South Acton Line'";
        break;
      case "lowell":
        content += " title='Lowell Line'";
        break;
      case "haverhill":
        content += " title='Haverhill / Reading Line'";
        break;
      case "newb_rock":
        content += " title='Newburyport / Rockport Line'";
        break;
      case "king_plym":
        content += " title='Old Colony Line'";
        break;
      case "middleborough":
        content += " title='Old Colony Line'";
        break;
      case "prov_stough":
        content += " title='Providence / Stoughton Line'";
        break;
      case "franklin":
        content += " title='Franklin Line'";
        break;
      case "fairmount":
        content += " title='Fairmount Line'";
        break;
      case "needham":
        content += " title='Needham Line'";
        break;
      case "worcester":
        content += " title='Framingham / Worcester Line'";
        break;
      default:
        content += " title='UNKNOWN TRAIN'";
        break;
    }
    
    content += "></li>";
  }
  
  content += "</ul></div>"
  
  $("#nameArea").html( "<h1>" + stationObject.name + "</h1>" + content );
}


/*
 * Utility function to string-ify the arrival time...
 *  arrObj     -- a full trip arrival object
 *  countdowns -- true  - construct an arrival time in minutes
 *                false - construct time like "12:44 PM"
 */
function timeToString( arrObj, countdowns )
{
  var arrival = "";
  
  if (countdowns) {
    // Make it into "web browser time"
    var time = new Date(arrObj.UNIXtime * 1000);
    var hour = time.getHours();
    var min  = time.getMinutes();
    var ampm = "";
    if (time.getSeconds >= 30)
      min += 1;           // Round up a minute if past 30 seconds
    if (min < 10)
      min = "0" + min;    // Leading 0
    if (hour > 12) {
      ampm = "pm";
      hour -= 12;
    } else if (hour == 0) {
      hour = 12;
      ampm = "am";
    } else {
      ampm = "am";
    }
    arrival  = hour + ":" + min + ampm;
  } else {
    arrival = Math.round( arrObj.Countdown / 60 ) + " min";
  }
  return arrival;
}


/*
 * Utility function to aid creation of individual arrival orbs
 * (needed by the displayArrivals function defined below)
 */
function makeCountdownOrb ( arrObj, countdowns )
{
  var time = "";
  
  if (arrObj.Type == "sch")
  
    if (arrObj.Countdown <= 60)
      time += " scheduled'>Due";
    else
      time += " scheduled'>" + timeToString( arrObj, countdowns );
  
  else if (arrObj.Type == "pre")
    time += " predicted'>" + timeToString( arrObj, countdowns );

  else if (arrObj.Type == "app")
    time += " approaching'>Approach";

  else if (arrObj.Type == "arr")
    time += " arriving'>Arriving";

  else if (arrObj.Type == "dep")
    time += " departing'>Depart";

  else if (arrObj.Type == "brd")
    time += " departing'>Boarding";

  else if (arrObj.Type == "del")
    time += " predicted'>Stopped";

  else
    time += " scheduled'>Unknown";
  
  return time;
}


/* 
 * This function will go through the masstrac.arrivals array and generate
 * the HTML for the arrivals.html page.
 * 
 * The arguments are the following:
 *   mode -- "time" or "dest", which way to sort the arrivals
 *   showTerm --   true  - show trips terminating at the selected station
 *                 false - hide trips which terminate at the station
 *   countdowns -- true  - show the minutes until a trip is expected to arrive
 *                 false - show the actual time a trip is expected to arrive
 */
function displayArrivals ( mode, showTerm, countdowns )
{
  // Arrival content stores into here
  var arrCont = "";
    
  if (masstrac.arrivals.length == 0) {
    arrCont += "No Predictable Train Arrivals (within ~2 hours)";
  }
  
  // Call the sorter to have the times displayed properly
  masstrac.sortArrivals( mode );
  
  switch (mode) {
  /////////////////////////////////////////////////////////////////////////////
  // SORTING OUTPUT PURELY BY ESTIMATED ARRIVAL TIME
  /////////////////////////////////////////////////////////////////////////////
  case "time":
    arrCont += "<div class='tableShell'>";

    for (var a = 0; a < masstrac.arrivals.length; a++) {

      arrCont += "<div class='trip'>";  // The trip contains the row of divs

      // Populate the content (columns) of each row.
      // First the route's name, like OR, CR, GR, RD, BL

      arrCont += "<div class='route";

      if (masstrac.arrivals[a].Line == "red")
        arrCont += " redLine'>RD</div>"
      else if (masstrac.arrivals[a].Line == "orange")
        arrCont += " orangeLine'>OR</div>";
      else if (masstrac.arrivals[a].Line == "blue")
        arrCont += " blueLine'>BL</div>";
      else {

        // Get rid of the ambiguity of Commuter Rail
        // Arrivals by matching the two-letter line code

        arrCont += " commuterRail'";

        switch (masstrac.arrivals[a].Line) {
          case "greenbush":
            arrCont += " title='Greenbush Line'>GB";
            break;
          case "fitchburg":
            arrCont += " title='Fitchburg / South Acton Line'>FB";
            break;
          case "lowell":
            arrCont += " title='Lowell Line'>LO";
            break;
          case "haverhill":
            arrCont += " title='Haverhill / Reading Line'>HA";
            break;
          case "newb_rock":
            arrCont += " title='Newburyport / Rockport Line'>NR";
            break;
          case "king_plym":
            arrCont += " title='Old Colony Line'>OC";
            break;
          case "middleborough":
            arrCont += " title='Old Colony Line'>OC";
            break;
          case "prov_stough":
            arrCont += " title='Providence / Stoughton Line'>PS";
            break;
          case "franklin":
            arrCont += " title='Franklin Line'>FR";
            break;
          case "fairmount":
            arrCont += " title='Fairmount Line'>FA";
            break;
          case "needham":
            arrCont += " title='Needham Line'>NE";
            break;
          case "worcester":
            arrCont += " title='Framingham / Worcester Line'>FW";
            break;
          default:
            arrCont += " title='UNKNOWN TRAIN'>##";
            break;
        }
        arrCont += "</div>";
      }

      // Then do the destination and any notes along with it
      arrCont += "<div class='destInfo'>" +
      "<span class='destination'>" +
      masstrac.arrivals[a].Destination + 
      "<br /></span>" + "<span class='tripInfo'>" +
      masstrac.arrivals[a].Note +
      "</span>" + "</div>";

      // Now finally plug in the countdown, color it according to the
      // TYPE of arrival the data says that it is. 

      arrCont += "<div class='countdown " +
                 makeCountdownOrb( masstrac.arrivals[a], countdowns ) +
                 "</div>";
      arrCont += "</div>";              // Closes the row of divs
    }

    arrCont += "</div>";  // Close the tableShell div
    break;
  
  /////////////////////////////////////////////////////////////////////////////
  // SORTING OUTPUT BY DESTINATION/LINE THEN TIME
  /////////////////////////////////////////////////////////////////////////////
  case "dest":
    
    var tripNo;
    
    // NOTE: See lib/structures.js for the details of the dest-sorted structure
    
    /*
     * RED LINE ARRIVALS
     */
    if (masstrac.arrSorted.red.a.length > 0 ||
        masstrac.arrSorted.red.b.length > 0 ||
        masstrac.arrSorted.red.c.length > 0   ) {
      
      // Create the header
      arrCont += "<ul class='sortArrival'><li class='route redLine'>" +
                 "RED LINE</li><ul>";
      
      arrCont += "<li class='destination'>Ashmont</li><ul>";
      for (tripNo = 0; tripNo < masstrac.arrSorted.red.a.length; tripNo++) {
        arrCont += "<li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.red.a[tripNo], countdowns ) +
                   "</li>";
      }
      arrCont += "</ul>";
      
      arrCont += "<li class='destination'>Braintree</li><ul>";
      for (tripNo = 0; tripNo < masstrac.arrSorted.red.b.length; tripNo++) {
        arrCont += "<li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.red.b[tripNo], countdowns ) +
                   "</li>";
      }
      arrCont += "</ul>";
      
      arrCont += "<li class='destination'>Alewife</li><ul>";
      for (tripNo = 0; tripNo < masstrac.arrSorted.red.c.length; tripNo++) {
        arrCont += "<li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.red.c[tripNo], countdowns ) +
                   "</li>";
      }
      arrCont += "</ul>";
      
      /*
       * Make sure destinations that are weird (like a trip destined for Harvard
       * instead of Alewife) still get shown. This was taken from the Commuter
       * Rail outbound data display idea implemented later in this function.
       */
      for (tripNo = 0; tripNo < masstrac.arrSorted.red.other.length; tripNo++) {
        arrCont += "<li class='destination outbound'>" + 
        masstrac.arrSorted.red.other[tripNo].Destination + "</li><li class='countdown" +
        makeCountdownOrb( masstrac.arrSorted.red.other[tripNo], countdowns ) + "</li>";
      }
      arrCont += "</ul>";
      
      // Close out the content block
      arrCont += "</ul></ul><br />";
      
    }   // END RED LINE PROCESSING
    
    /*
     * ORANGE LINE ARRIVALS
     */
    if (masstrac.arrSorted.orange.f.length > 0 ||
        masstrac.arrSorted.orange.o.length > 0   ) {
      
      // Create the header
      arrCont += "<ul class='sortArrival'><li class='route orangeLine'>" +
                 "ORANGE LINE</li><ul>";
      
      arrCont += "<li class='destination'>Forest Hills</li><ul>";
      for (tripNo = 0; tripNo < masstrac.arrSorted.orange.f.length; tripNo++) {
        arrCont += "<li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.orange.f[tripNo], countdowns ) +
                   "</li>";
      }
      arrCont += "</ul>";
      
      arrCont += "<li class='destination'>Oak Grove</li><ul>";
      for (tripNo = 0; tripNo < masstrac.arrSorted.orange.o.length; tripNo++) {
        arrCont += "<li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.orange.o[tripNo], countdowns ) +
                   "</li>";
      }
      arrCont += "</ul>";
      
      for (tripNo = 0; tripNo < masstrac.arrSorted.orange.other.length; tripNo++) {
        arrCont += "<li class='destination outbound'>" + 
        masstrac.arrSorted.orange.other[tripNo].Destination + "</li><li class='countdown" +
        makeCountdownOrb( masstrac.arrSorted.orange.other[tripNo], countdowns ) + "</li>";
      }
      arrCont += "</ul>";
      
      // Close out the content block
      arrCont += "</ul></ul><br />";
      
    }   // END ORANGE LINE PROCESSING
    
    /*
     * BLUE LINE ARRIVALS
     */
    if (masstrac.arrSorted.blue.b.length > 0 ||
        masstrac.arrSorted.blue.w.length > 0   ) {
      
      // Create the header
      arrCont += "<ul class='sortArrival'><li class='route blueLine'>" +
                 "BLUE LINE</li><ul>";
      
      arrCont += "<li class='destination'>Bowdoin</li><ul>";
      for (tripNo = 0; tripNo < masstrac.arrSorted.blue.b.length; tripNo++) {
        arrCont += "<li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.blue.b[tripNo], countdowns ) +
                   "</li>";
      }
      arrCont += "</ul>";
      
      arrCont += "<li class='destination'>Wonderland</li><ul>";
      for (tripNo = 0; tripNo < masstrac.arrSorted.blue.w.length; tripNo++) {
        arrCont += "<li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.blue.w[tripNo], countdowns ) +
                   "</li>";
      }
      arrCont += "</ul>";
      
      for (tripNo = 0; tripNo < masstrac.arrSorted.blue.other.length; tripNo++) {
        arrCont += "<li class='destination outbound'>" + 
        masstrac.arrSorted.blue.other[tripNo].Destination + "</li><li class='countdown" +
        makeCountdownOrb( masstrac.arrSorted.blue.other[tripNo], countdowns ) + "</li>";
      }
      arrCont += "</ul>";
      
      // Close out the content block
      arrCont += "</ul></ul><br />";
      
    }   // END BLUE LINE PROCESSING
    
    /*
     * COMMUTER RAIL ARRIVALS
     */
    if (masstrac.arrSorted.cr.inb.length > 0 ||
        masstrac.arrSorted.cr.out.length > 0   ) {
      
      // Create the header
      arrCont += "<ul class='sortArrival'><li class='route commuterRail'>" +
                 "COMMUTER RAIL</li><ul>";
      
      /*
       * Only assign the first-found inbound destination as the destination
       * of all trips inbound because there's no physical link between
       * North and South Station.
       */
      if (masstrac.arrSorted.cr.inb.length > 0) {
        arrCont += "<li class='destination'>" + 
                   masstrac.arrSorted.cr.inb[0].Destination + "</li><ul>";
      
        for (tripNo = 0; tripNo < masstrac.arrSorted.cr.inb.length; tripNo++) {
          arrCont += "<li class='countdown" +
                     makeCountdownOrb( masstrac.arrSorted.cr.inb[tripNo], countdowns ) +
                     "</li>";
        }
        arrCont += "</ul>";
      }
      
      /*
       * This is where the Commuter Rail data will be sorted a little
       * differently than its subway brethren. It's too messy to try and
       * capture all possible outbound Commuter Rail Trips, so they were
       * all placed into one array. To display this with any clarity, we
       * have to just take a whole line per each outbound arrival.
       * (Hence the "outbound" CSS class we've used).
       */
      for (tripNo = 0; tripNo < masstrac.arrSorted.cr.out.length; tripNo++) {
        arrCont += "<li class='destination outbound'>" + 
                   masstrac.arrSorted.cr.out[tripNo].Destination + "</li><li class='countdown" +
                   makeCountdownOrb( masstrac.arrSorted.cr.out[tripNo], countdowns ) + "</li>";
      }
      
      arrCont += "</ul>";
      
      // Close out the content block
      arrCont += "</ul></ul>";
      
    }   // END COMMUTER RAIL PROCESSING
    
    break;
  }
  $("#predictArea").html( "<h2>Upcoming Train Arrivals</h2>" + arrCont );
}


/*
 * This function will display the Green Line scheduled headway information
 * to the arrivals.html page.
 */
function displayGreenLine ()
{
  // Now populate the green line headways (if present)
  var greenText ="<div class='tableShell'>";
    
  if (masstrac.greenLine.b !== undefined) {
        
    greenText += "<div class='trip'><div class='route greenLine'>B</div><div class='destInfo'>" +
                "<span class='destination'>" + masstrac.greenLine.b.West_Term + "<br />" +
                masstrac.greenLine.b.East_Term +
                "</span></div><div class='countdown scheduled'><span class='note'>Trains Every</span><br />" +
                masstrac.greenLine.b.Headway + " min</div></div>";
  }
  if (masstrac.greenLine.c !== undefined) {
        
    greenText += "<div class='trip'><div class='route greenLine'>C</div><div class='destInfo'>" +
                "<span class='destination'>" + masstrac.greenLine.c.West_Term + "<br />" +
                masstrac.greenLine.c.East_Term +
                "</span></div><div class='countdown scheduled'><span class='note'>Trains Every</span><br />" +
                masstrac.greenLine.c.Headway + " min</div></div>";
  }
  if (masstrac.greenLine.d !== undefined) {
        
    greenText += "<div class='trip'><div class='route greenLine'>D</div><div class='destInfo'>" +
                "<span class='destination'>" + masstrac.greenLine.d.West_Term + "<br />" +
                masstrac.greenLine.d.East_Term +
                "</span></div><div class='countdown scheduled'><span class='note'>Trains Every</span><br />" +
                masstrac.greenLine.d.Headway + " min</div></div>";
  }
  if (masstrac.greenLine.e !== undefined) {
        
    greenText += "<div class='trip'><div class='route greenLine'>E</div><div class='destInfo'>" +
                 "<span class='destination'>" + masstrac.greenLine.e.West_Term + "<br />" +
                 masstrac.greenLine.e.East_Term +
                 "</span></div><div class='countdown scheduled'><span class='note'>Trains Every</span><br />" +
                 masstrac.greenLine.e.Headway + " min</div></div>";
  }
  
  
  if (masstrac.greenLine.b !== undefined ||
      masstrac.greenLine.c !== undefined ||
      masstrac.greenLine.d !== undefined ||
      masstrac.greenLine.e !== undefined   )
        
    $("#greenArea").html( "<h2>Green Line Headways</h2>" + greenText );
    
  else
    $("#greenArea").hide();
}


/*
 * This function will display the alerts contained in masstrac.alerts to
 * the arrivals.html page.
 */
function displayAlerts ()
{
  var alertCont = "";
    
  for (var alertNum = 0; alertNum < masstrac.alerts.length; alertNum++) {
        
    alertCont += "<b>" + masstrac.alerts[alertNum].title + 
    "</b><br />" + masstrac.alerts[alertNum].content + "<br /><br />";
        
  }
    
  $("#alertsArea").html( alertCont );
}


/*
 * This function will render the bus connections available from the station.
 * Send this function the station object (i.e. the object found after accessing
 * masstrac.stations[4], for example.
 */
function displayBus ( station )
{
  var busConnect = "<ul>";
  
  for (var num = 0; num < station.bus.length; num++)
    busConnect += "<li><a href=http://www.mbta.com/schedules_and_maps/bus/routes/?route=" +
                  station.bus[num] + " target='_blank'>" + station.bus[num] + "</a></li>";
  
  busConnect += "</ul>";

  $("#busArea").html( busConnect );
}
