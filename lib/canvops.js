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

canvops.orangeSouth = 285;  // Pixels from left of image for southbound arrows
canvops.orangeNorth = 375;  // Pixels from left of image for northbound arrows

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
 * Drawing PNGs straight to the canvas widget is no simple task, so the method
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
      cxt.drawImage( canvops.redMap, 0, 0 );
      break;
    case "blue":
      c = document.getElementById( 'bluePlot' );
      cxt = c.getContext( '2d' );
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
 * Helper function to decide which arrow to load based on the heading.
 * Takes a heading in the form of degrees true north
 * Returns the appropriate image for the heading passed in.
 */
canvops.determineHeading = function (heading)
{
  if (heading > 337.5 || heading < 22.5) {
    // NORTH
    return canvops.arrowN;
    
  } else if (heading < 67.5) {
    // NORTHEAST
    return canvops.arrowNE;
    
  } else if (heading < 112.5) {
    // EAST
    return canvops.arrowE;
    
  } else if (heading < 157.5) {
    // SOUTHEAST
    return canvops.arrowSE;
    
  } else if (heading < 202.5) {
    // SOUTH
    return canvops.arrowS;
    
  } else if (heading < 247.5) {
    // SOUTHWEST
    return canvops.arrowSW;
    
  } else if (heading < 292.5) {
    // WEST
    return canvops.arrowW;
    
  } else {
    // NORTHWEST
    return canvops.arrowNW;
  }
  return false;
};   // End function determineHeading( heading )


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
     * Red Line Map:
     *   42.4012, -71.2112 --> Canvas Pixels: (0,0)
     *   LAT / px = -0.000415   LON / px = 0.000568
     */
    case "red":
      c = document.getElementById( 'redPlot' );
      cxt = c.getContext( '2d' );
      
      /*
       * Go through each of the arrivals and see if position data is available.
       * If it is, then ask the helper function to fetch the appropriate icon
       * to indicate the heading and then plot the icon into the canvas.
       */
      for (trip = 0; trip < masstrac.trips.length; trip++) {
        if (masstrac.trips[trip].TripID.substring(0, 1) == "R" &&
            masstrac.trips[trip].lat !== undefined &&
            masstrac.trips[trip].lon !== undefined   ) {
          
          icon = canvops.determineHeading( masstrac.trips[trip].heading );
          
          // Where should it go? (In pixels)
          xPos = (masstrac.trips[trip].lon - (-71.2112)) /  0.000568 - canvops.iconW;
          yPos = (masstrac.trips[trip].lat - ( 42.4012)) / -0.000415 - canvops.iconH;
          
          cxt.drawImage( icon, xPos, yPos );
        }
      }
      
    break;

    /*
     * Blue Line Map:
     *   42.4186, -71.0698 --> Canvas Pixels: (0,0)
     *   LAT / px = -0.000135   LON / px = 0.000185
     */
    case "blue":
      c = document.getElementById( 'bluePlot' );
      cxt = c.getContext( '2d' );
      
      for (trip = 0; trip < masstrac.trips.length; trip++) {
        if (masstrac.trips[trip].TripID.substring(0, 1) == "B" &&
            masstrac.trips[trip].lat !== undefined &&
            masstrac.trips[trip].lon !== undefined   ) {
          
          icon = canvops.determineHeading( masstrac.trips[trip].heading );
          
          // Where should it go? (In pixels)
          xPos = (masstrac.trips[trip].lon - (-71.0698)) /  0.000185 - canvops.iconW;
          yPos = (masstrac.trips[trip].lat - ( 42.4186)) / -0.000135 - canvops.iconH;
          
          cxt.drawImage( icon, xPos, yPos );
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
//      for (trip = 0; trip < masstrac.trips.length; trip++) {
//        if (masstrac.trips[trip].TripID.substring(0, 1) == "O" &&
//            masstrac.trips[trip].lat !== undefined &&
//            masstrac.trips[trip].lon !== undefined   ) {
//          
//          icon = canvops.determineHeading( masstrac.trips[trip].heading );
//          
//          // Where should it go? (In pixels)
//          xPos = (masstrac.trips[trip].lon - (-71.1797)) /  0.000410 - canvops.iconW;
//          yPos = (masstrac.trips[trip].lat - ( 42.4406)) / -0.000305 - canvops.iconH;
//          
//          cxt.drawImage( icon, xPos, yPos );
//        }
//      }
//      
//      break;
      
    default:
      return false;
  }
  
  return true;
};