/* 
 * Filename: canvops.json
 * 
 * Author: Daniel Brook, UMass Lowell Student, daniel_brook@student.uml.edu
 * 
 * This script file contains all operations pertaining to the canvas widgets
 * that display the real-time location of trains in the system. 
 * 
 * NOTE: These operations rely on the masstrac.trips[] array being populated
 * with tracking data. Currently only the Red, Blue, and Orange Lines support 
 * this because the Commuter Rail data feeds are a mess (and a lot less 
 * interesting because fewer trains run on those lines simultaneously).
 */
var canvops = new Object();

/*
 * Since we'll be plotting with icons which take up space, we should track the
 * radius of the plot icons so we can correct the positioning of them 
 * (this is to basically fix the fact that when placing images, you choose the
 * position of the UPPER LEFT corner relative to the canvas's upper-left corner
 * and not the center of the image).
 */
canvops.iconW = 15 / 2;    // pixels
canvops.iconH = 15 / 2;    // pixels

/*
 * Background-loading these images when the page first runs will stop the 
 * problem we had with maps being half-loaded (like certain arrows not being
 * in memory and thus not drawn until the next refresh, which would then make
 * other arrows not appear. 
 */
canvops.redMap = new Image();
canvops.redMap.src = "img/red_complete.png";
canvops.blueMap = new Image();
canvops.blueMap.src = "img/blue_complete.png";
canvops.orangeMap = new Image();
canvops.orangeMap.src = "img/orange_complete.png";
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
canvops.basemap = function ( line )
{
  // Capture the appropriate image for the argument passed.
  var c;
  var cxt;
  
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
      cxt.clearRect( 0, 0, 475, 475 );
      break;
    case "blue":
      c = document.getElementById( 'bluePlot' );
      cxt = c.getContext( '2d' );
      cxt.clearRect( 0, 0, 475, 475 );
      break;
    case "orange":
      c = document.getElementById( 'orangePlot' );
      cxt = c.getContext( '2d' );
      cxt.clearRect( 0, 0, 475, 475 );
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
 * train locations it can find. We plot this using a linearly-interpolated
 * projection despite these maps being traced from Google Maps (Mercator 
 * Projection). Because of the small scale of the lines, we can get away with
 * this and the distortion will be basically unnoticeable.
 * 
 * Each of the custom maps I made will have to have their own coordinate system
 * due to the different geographical regions each one covers (like the Red Line
 * has a wide geographic reach compared to the Blue Line).
 * 
 * This requires the masstrac.trips array to be populated first, otherwise
 * nothing will get rendered.
 */
canvops.plotTrips = function (line) {
  
  var c;
  var cxt;
  
  var xPos, yPos, trip, icon;
  
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
     * Orange Line Map:
     *   42.4406, -71.1797 --> Canvas Pixels: (0,0)
     *   LAT / px = -0.000305   LON / px = 0.000410
     */
    case "orange":
      c = document.getElementById( 'orangePlot' );
      cxt = c.getContext( '2d' );
      
      for (trip = 0; trip < masstrac.trips.length; trip++) {
        if (masstrac.trips[trip].TripID.substring(0, 1) == "O" &&
            masstrac.trips[trip].lat !== undefined &&
            masstrac.trips[trip].lon !== undefined   ) {
          
          icon = canvops.determineHeading( masstrac.trips[trip].heading );
          
          // Where should it go? (In pixels)
          xPos = (masstrac.trips[trip].lon - (-71.1797)) /  0.000410 - canvops.iconW;
          yPos = (masstrac.trips[trip].lat - ( 42.4406)) / -0.000305 - canvops.iconH;
          
          cxt.drawImage( icon, xPos, yPos );
        }
      }
      
      break;
      
    default:
      return false;
  }
  
  return true;
};