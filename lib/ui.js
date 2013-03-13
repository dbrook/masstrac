/* 
 * Filename: ui.js
 * 
 * Programmers:
 * Daniel Brook, UMass Lowell Student, daniel_brook@student.uml.edu
 * Austin Veino, UMass Lowell Student, austin_veino@student.uml.edu
 * Jivani Cassar, UMass Lowell Student, jivani_cassar@student.uml.edu
 * 
 * Page updated by Daniel Brook on 2013-03-13 at 4:50 PM
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
 * This function will go through the masstrac.arrivals array and generate
 * the HTML for the arrivals.html page.
 */
function displayArrivals ()
{
  // Arrival content stores into here
  var arrCont = "";
    
  if (masstrac.arrivals.length == 0) {
    arrCont += "No Predictable Train Arrivals (within ~2 hours)";
  }
  
  // Call the sorter to have the times displayed properly
  masstrac.sortArrivals( "time" );
  
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

    arrCont += "<div class='countdown";
    if (masstrac.arrivals[a].Type == "pre") {

      arrCont += " predicted'>" +
      Math.round( masstrac.arrivals[a].Countdown / 60 ) +
      " min</div>";

    } else if (masstrac.arrivals[a].Type == "sch") {

      // Is the trip 'scheduled' but shold be here? Say 'due',
      // otherwise, just print the expected arrival time.

      if (Math.round( masstrac.arrivals[a].Countdown / 60 ) <= 1) {

        arrCont += " scheduled'>Due</div>";

      } else {
        arrCont += " scheduled'>" +
        Math.round( masstrac.arrivals[a].Countdown / 60 ) +
        " min</div>";
      }

    } else if (masstrac.arrivals[a].Type == "app" ) {
      arrCont += " approaching'>Approach</div>";
    } else if (masstrac.arrivals[a].Type == "arr" ) {
      arrCont += " arriving'>Arriving</div>";
    } else if (masstrac.arrivals[a].Type == "dep" ) {
      arrCont += " departing'>Departing</div>";
    } else if (masstrac.arrivals[a].Type == "brd" ) {
      arrCont += " departing'>Boarding</div>";
    } else {
      arrCont += " scheduled'>Unknown</div>";
    }

    arrCont += "</div>";              // Closes the row of divs
  }

  arrCont += "</div>";  // Close the tableShell div
    
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
    
  $("#alertsArea").html( "<h2>Service Alerts</h2>" + alertCont );
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

  $("#busArea").html( "<h2>Buses</h2>" + busConnect );
}