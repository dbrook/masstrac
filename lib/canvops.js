/* 
 * Filename: canvops.json
 * 
 * Author: Daniel Brook, UMass Lowell Student, daniel_brook@student.uml.edu
 * 
 * Last Updated by Daniel Brook on 2013-04-20 at 10:30 PM
 * 
 * This script file contains all operations pertaining to the canvas widgets
 * that display the real-time location of trains in the system. 
 * 
 * NOTE: These operations rely on the masstrac.trips[] array being populated
 * with tracking data. Currently only the Red, Blue, Orange, and Commuter Rail
 * Lines support this. Commuter Rail maps use exact GPS coordinates, as well,
 * instead of the odd system in place with the subway data where locations are
 * only updated when passing signals (from the best of my knowledge).
 */
var canvops = new Object();

/*
 * Since we'll be plotting with icons which take up space, we should track the
 * radius of the plot icons so we can correct the positioning of them 
 * (this is to basically fix the fact that when placing images, you choose the
 * position of the UPPER LEFT corner relative to the canvas's upper-left corner
 * and not the center of the image).
 */
canvops.iconW = 15 / 2;     // pixels
canvops.iconH = 15 / 2;     // pixels

canvops.rectW = 475;        // pixels
canvops.rectH = 24;         // pixels

canvops.orangeSouth = 280;  // Pixels from left of image for southbound arrows
canvops.orangeNorth = 355;  // Pixels from left of image for northbound arrows

canvops.blueEast = 355;  // Pixels from left of image for southbound arrows
canvops.blueWest = 280;  // Pixels from left of image for northbound arrows

canvops.redSouthC = 200;   // Northbound trips for Cambridge/Boston
canvops.redNorthC = 265;   // Northbound trips for Cambridge/Boston
canvops.redSouthB = 250;   // Northbound trips for Braintree Extension
canvops.redNorthB = 310;   // Northbound trips for Braintree Extension
canvops.redSouthA = 165;   // Northbound trips for Dorchester Extension
canvops.redNorthA = 210;   // Northbound trips for Dorchester Extension

/*
 * Background-loading these images when the page first runs will stop the 
 * problem we had with maps being half-loaded (like certain arrows not being
 * in memory and thus not drawn until the next refresh, which would then make
 * other arrows not appear. 
 */
canvops.redMap = new Image();
canvops.redMap.src = "img/red_strip.png";
canvops.blueMap = new Image();
canvops.blueMap.src = "img/blue_strip.png";
canvops.orangeMap = new Image();
canvops.orangeMap.src = "img/orange_strip.png";
canvops.arrowN = new Image();
canvops.arrowN.src = "img/arrowN.png";
canvops.arrowNE = new Image();
canvops.arrowNE.src = "img/arrowNE.png";
canvops.arrowE = new Image();
canvops.arrowE.src = "img/arrowE.png";
canvops.arrowSE = new Image();
canvops.arrowSE.src = "img/arrowSE.png";
canvops.arrowS = new Image();
canvops.arrowS.src = "img/arrowS.png";
canvops.arrowSW = new Image();
canvops.arrowSW.src = "img/arrowSW.png";
canvops.arrowW = new Image();
canvops.arrowW.src = "img/arrowW.png";
canvops.arrowNW = new Image();
canvops.arrowNW.src = "img/arrowNW.png";


/*
 * This function draws the base map to the canvas widget. It accepts the
 * following arguments: "red", "blue", "orange".
 * 
 * This is what makes our site only work on modern-ish browsers.
 * The canvas operations aren't supported in anything before HTML5.
 * 
 * Drawing PNGs straight to the canvas widget is actually simple, the method
 * of importing and drawing was adopted from here:
 *      http://stackoverflow.com/questions/5124892/how-can-i-load-an-image-onto-the-html5-canvas-using-phonegap
 */
canvops.basemap = function ( name, line )
{
  // Capture the appropriate image for the argument passed.
  var c;
  var cxt;
  
  var staObj = masstrac.lookupStation( name );
  
  switch (line) {
    case "red":
      c = document.getElementById( 'redPlot' );
      cxt = c.getContext( '2d' );
      cxt.fillStyle = "rgb(180, 180, 180)";
      
      // Depending on the Red Line section, draw the station box differently
      if (staObj.redMap.sec == "Dorchester") {
        cxt.fillRect(0, staObj.redMap.sta - canvops.rectH / 2,
                     canvops.rectW / 2, canvops.rectH);
      } else if (staObj.redMap.sec == "Braintree") {
        cxt.fillRect(canvops.rectW / 2, staObj.redMap.sta - canvops.rectH / 2,
                     canvops.rectW / 2, canvops.rectH);
      } else {
        cxt.fillRect(0, staObj.redMap.sta - canvops.rectH / 2,
                     canvops.rectW, canvops.rectH);
      }
      cxt.drawImage( canvops.redMap, 0, 0 );
      break;
    case "blue":
      c = document.getElementById( 'bluePlot' );
      cxt = c.getContext( '2d' );
      cxt.fillStyle = "rgb(180, 180, 180)";
      cxt.fillRect(0, staObj.blueMap.sta - canvops.rectH / 2,
                   canvops.rectW, canvops.rectH);
      cxt.drawImage( canvops.blueMap, 0, 0 );
      break;
    case "orange":
      c = document.getElementById( 'orangePlot' );
      cxt = c.getContext( '2d' );
      cxt.fillStyle = "rgb(180, 180, 180)";
      cxt.fillRect(0, staObj.orangeMap.sta - canvops.rectH / 2,
                   canvops.rectW, canvops.rectH);
      cxt.drawImage( canvops.orangeMap, 0, 0 );
      break;
    default:
      return false;
  }
  return true;
};   // End function basemap( string line )


/*
 * Clears the canvas of the requested line plot.
 * Like the basemap function, this will only accept the following:
 *   "red", "blue", and "orange"
 */
canvops.clearplot = function ( line )
{
  var c;
  var cxt;
  
  switch (line) {
    case "red":
      c = document.getElementById( 'redPlot' );
      cxt = c.getContext( '2d' );
      cxt.clearRect( 0, 0, 475, 525 );
      break;
    case "blue":
      c = document.getElementById( 'bluePlot' );
      cxt = c.getContext( '2d' );
      cxt.clearRect( 0, 0, 475, 525 );
      break;
    case "orange":
      c = document.getElementById( 'orangePlot' );
      cxt = c.getContext( '2d' );
      cxt.clearRect( 0, 0, 475, 525 );
      break;
    default:
      return false;
  }
  return true;
};   // End function clearplot( string line )


/*
 * The plotting function will go through masstrac.trips[] and plot all of the
 * train locations it can find. These numbers are fixed to the strip maps
 * produced through Inkscape to render our own custom MBTA map. If the stations
 * ever changed, the graphics and all the coords. will have to as well (in the
 * stations.js file). Fun.
 * 
 * This requires the masstrac.trips array to be populated first, otherwise
 * nothing will get rendered.
 */
canvops.plotTrips = function (line)
{
  var c;
  var cxt;
  var xPos, yPos, trip, icon;
  var staObj;
  
  switch (line) {
    /*
     * Red Line Map
     */
    case "red":
      c = document.getElementById( 'redPlot' );
      cxt = c.getContext( '2d' );
      
      for (trip = 0; trip < masstrac.trips.length; ++trip) {
        if (masstrac.trips[trip].TripID.substring(0,1) == "R" &&
            masstrac.trips[trip].heading !== undefined) {
          
          staObj = masstrac.lookupStation(masstrac.trips[trip].Predictions[0].Station);
          
          /*
           * The Red Line is a little complicated to draw the arrows for
           * because it snakes through Boston going many different directions
           * that the simple "going north/south?" approach cannot apply. To
           * get around this, I've divided the line into its segments:
           *   - Cambridge Tunnel
           *   - Boston Subway
           *   - Dorchester Extension (Ashmont Branch)
           *   - Braintree Extension (Braintree Branch)
           */
          switch (staObj.redMap.sec) {
            case "Cambridge":
              if (masstrac.trips[trip].heading >= 225 ||
                  masstrac.trips[trip].heading <= 45) {
                cxt.drawImage( canvops.arrowN,
                               canvops.redNorthC - canvops.iconW / 2,
                               staObj.redMap.up - canvops.iconH / 2 );
              } else {
                cxt.drawImage( canvops.arrowS,
                               canvops.redSouthC - canvops.iconW / 2,
                               staObj.redMap.dn - canvops.iconH / 2 );
              }
              break;
            case "Boston":
              if (masstrac.trips[trip].heading >= 270 ||
                  masstrac.trips[trip].heading <= 90) {
                cxt.drawImage( canvops.arrowN,
                               canvops.redNorthC - canvops.iconW / 2,
                               staObj.redMap.up - canvops.iconH / 2 );
              } else {
                cxt.drawImage( canvops.arrowS,
                               canvops.redSouthC - canvops.iconW / 2,
                               staObj.redMap.dn - canvops.iconH / 2 );
              }
              break;
            case "Dorchester":
              if (masstrac.trips[trip].heading >= 270 ||
                  masstrac.trips[trip].heading <= 90) {
                cxt.drawImage( canvops.arrowN,
                               canvops.redNorthA - canvops.iconW / 2,
                               staObj.redMap.up - canvops.iconH / 2 );
              } else {
                cxt.drawImage( canvops.arrowS,
                               canvops.redSouthA - canvops.iconW / 2,
                               staObj.redMap.dn - canvops.iconH / 2 );
              }
              break;
            case "Braintree":
              if (masstrac.trips[trip].heading >= 270 ||
                  masstrac.trips[trip].heading <= 90) {
                cxt.drawImage( canvops.arrowN,
                               canvops.redNorthB - canvops.iconW / 2,
                               staObj.redMap.up - canvops.iconH / 2 );
              } else {
                cxt.drawImage( canvops.arrowS,
                               canvops.redSouthB - canvops.iconW / 2,
                               staObj.redMap.dn - canvops.iconH / 2 );
              }
              break;
          }
        }
      }
      break;

    /*
     * Blue Line Map
     */
    case "blue":
      c = document.getElementById( 'bluePlot' );
      cxt = c.getContext( '2d' );
      
      for (trip = 0; trip < masstrac.trips.length; ++trip) {
        if (masstrac.trips[trip].TripID.substring(0,1) == "B" &&
            masstrac.trips[trip].heading !== undefined) {
          
          staObj = masstrac.lookupStation(masstrac.trips[trip].Predictions[0].Station);
          
          // Determine which side to draw based on last-known heading East/West
          if (masstrac.trips[trip].heading >= 350 ||
              masstrac.trips[trip].heading <= 160) {
            // West Bound to Wonderland
            cxt.drawImage( canvops.arrowN,
                           canvops.blueEast - canvops.iconW / 2,
                           staObj.blueMap.up - canvops.iconH / 2 );
          } else {
            // East Bound to Government Center / Bowdoin
            cxt.drawImage( canvops.arrowS,
                           canvops.blueWest - canvops.iconW / 2,
                           staObj.blueMap.dn - canvops.iconH / 2);
          }
        }
      }
      break;

    /*
     * Orange Line Map
     */
    case "orange":
      c = document.getElementById( 'orangePlot' );
      cxt = c.getContext( '2d' );
      
      for (trip = 0; trip < masstrac.trips.length; ++trip) {
        if (masstrac.trips[trip].TripID.substring(0,1) == "O" &&
            masstrac.trips[trip].heading !== undefined) {
          
          staObj = masstrac.lookupStation(masstrac.trips[trip].Predictions[0].Station);
          
          if (masstrac.trips[trip].heading > 270 ||
              masstrac.trips[trip].heading < 90) {
            // North Bound/
            cxt.drawImage( canvops.arrowN,
                           canvops.orangeNorth - canvops.iconW / 2,
                           staObj.orangeMap.up - canvops.iconH / 2 );
          } else {
            // South Bound
            cxt.drawImage( canvops.arrowS,
                           canvops.orangeSouth - canvops.iconW / 2,
                           staObj.orangeMap.dn - canvops.iconH / 2);
          }
        }
      }
      break;

    default:
      return false;
  }
  
  return true;
};