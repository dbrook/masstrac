/* 
 * Filename: canvops.json
 * 
 * Author: Daniel Brook, UMass Lowell Student, daniel_brook@student.uml.edu
 * 
 * Last Updated by Daniel Brook on 2013-04-23 at 9:30 PM
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
canvops.iconW = 13;                    // pixels
canvops.iconH = 13;                    // pixels
//canvops.iconLineColor = "#3914AF";     // RGB
//canvops.iconFillColor = "#FF0000";     // RGB
canvops.iconLineColor = "#000000";     // RGB
canvops.iconFillColor = "#FFFFFF";     // RGB
canvops.iconLineWidth = 1;             // Unit of????

canvops.rectW = 475;        // pixels
canvops.rectH = 24;         // pixels

// Orange Line Plot Column Coordinates
canvops.orangeSouth = 285;  // Pixels from left of image for southbound arrows
canvops.orangeNorth = 360;  // Pixels from left of image for northbound arrows

// Blue Line Plot Column Coordinates
canvops.blueEast = 355;     // Pixels from left of image for southbound arrows
canvops.blueWest = 290;     // Pixels from left of image for northbound arrows

// Red Line Plot Column Coordinates
canvops.redSouthC = 210;    // Northbound trips for Cambridge/Boston
canvops.redNorthC = 270;    // Northbound trips for Cambridge/Boston
canvops.redSouthB = 258;    // Northbound trips for Braintree Extension
canvops.redNorthB = 310;    // Northbound trips for Braintree Extension
canvops.redSouthA = 170;    // Northbound trips for Dorchester Extension
canvops.redNorthA = 215;    // Northbound trips for Dorchester Extension

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
      
      /* 
       * Chrome has an additional problem of simply choosing not to display 
       * loaded PNG files. To compensate for this, the solution here:
       *      http://stackoverflow.com/questions/12387310/html5-drawimage-works-in-firefox-not-chrome
       * was applied.
       * (Basically have to do this for each line. Thankfully it doesn't anger
       * the other browsers)
       */
      canvops.redMap.onload = function () {
        cxt.drawImage( canvops.redMap, 0, 0 );
      };

      cxt.drawImage( canvops.redMap, 0, 0 );
      break;
    case "blue":
      c = document.getElementById( 'bluePlot' );
      cxt = c.getContext( '2d' );
      cxt.fillStyle = "rgb(180, 180, 180)";
      cxt.fillRect(0, staObj.blueMap.sta - canvops.rectH / 2,
                   canvops.rectW, canvops.rectH);

      canvops.blueMap.onload = function () {
        cxt.drawImage( canvops.blueMap, 0, 0 );
      };

      cxt.drawImage( canvops.blueMap, 0, 0 );
      break;
    case "orange":
      c = document.getElementById( 'orangePlot' );
      cxt = c.getContext( '2d' );
      cxt.fillStyle = "rgb(180, 180, 180)";
      cxt.fillRect(0, staObj.orangeMap.sta - canvops.rectH / 2,
                   canvops.rectW, canvops.rectH);
      
      canvops.orangeMap.onload = function () {
        cxt.drawImage( canvops.orangeMap, 0, 0 );
      };

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
 * This is a utility function to draw triangles manually onto the canvas. This
 * is a complete workaround for the Chrome "I don't feel like actually drawing 
 * PNGs into the canvas" bug that would required very messy .onload() handlers
 * to properly fix. 
 * 
 * drawTriangle( {canvas drawing context},
 *               {bool true: face up, false: face down},
 *               {center x coords}, 
 *               {center y coords} )
 */
canvops.drawTriangle = function (context, dirU, xpos, ypos)
{
  /*
   * This code comes courtesy of:
   * http://dev.opera.com/articles/view/html-5-canvas-the-basics/
   */
  
  // Set the style properties.
  context.fillStyle   = canvops.iconFillColor;
  context.strokeStyle = canvops.iconLineColor;
  context.lineWidth   = canvops.iconLineWidth;
  
  /*
   * Before we can begin, we need to compute some offsets (since the caller
   * requests where to draw the triangle's CENTER.
   * 
   * This involves some weird simple geometric calculations. Basically imagine
   * a triangle with oviously 3 corners. The drawing process will start from
   * corner A to corner B, and then corner B to corner C, then connect corner C
   * back to corner A, then fill in the contents with fillStyle, and outline it
   * with the color stored in strokeStyle (obeying lineWidth).
   */
  var cornerAx, cornerAy, cornerBx, cornerBy, cornerCx, cornerCy;
  
  if (dirU) {
    // "Arrow facing up" corner calculations
    cornerAx = xpos + canvops.iconW / 2;
    cornerAy = ypos + canvops.iconH / 2;
    cornerBx = xpos - canvops.iconW / 2;
    cornerBy = ypos + canvops.iconH / 2;
    cornerCx = xpos;
    cornerCy = ypos - canvops.iconH / 2;
    
  } else {
    // "Arrow facing down" corner calculations
    cornerAx = xpos - canvops.iconW / 2;
    cornerAy = ypos - canvops.iconH / 2;
    cornerBx = xpos + canvops.iconW / 2;
    cornerBy = ypos - canvops.iconH / 2;
    cornerCx = xpos;
    cornerCy = ypos + canvops.iconH / 2;
    
  }
  
  // Now actually start drawing based on the procedure detailed above
  context.beginPath();
  context.moveTo(cornerAx, cornerAy);
  context.lineTo(cornerBx, cornerBy);
  context.lineTo(cornerCx, cornerCy);
  context.lineTo(cornerAx, cornerAy);
  
  // Now fill the shape, and draw the stroke (line).
  // Note: your shape will not be visible until you call any of the two methods.
  context.fill();
  context.stroke();
  context.closePath();
};   // End function drawTriangle( bool dirUD, int xpos, int ypos )


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
  var staObj, countdown;
  
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
          
          // Make the following code a little more concise
          staObj = masstrac.lookupStation(masstrac.trips[trip].Predictions[0].Station);
          countdown = masstrac.trips[trip].Predictions[0].Countdown;
          
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
                
                if (countdown <= 60) {
                  // Draw the arrow "at" the station because that train is close
                  canvops.drawTriangle( cxt, true, canvops.redNorthC, staObj.redMap.sta );
                } else {
                  // Draw the arrow "before" the station because the train has
                  // a little ways to go.
                  canvops.drawTriangle( cxt, true, canvops.redNorthC, staObj.redMap.up );
                }
              } else {
                if (countdown <= 60) {
                  canvops.drawTriangle( cxt, false, canvops.redSouthC, staObj.redMap.sta );
                } else {
                  canvops.drawTriangle( cxt, false, canvops.redSouthC, staObj.redMap.dn );
                }
              }
              break;
              
            case "Boston":
              if (masstrac.trips[trip].heading >= 270 ||
                  masstrac.trips[trip].heading <= 90) {
                
                if (countdown <= 60) {
                  canvops.drawTriangle( cxt, true, canvops.redNorthC, staObj.redMap.sta );
                } else {
                  canvops.drawTriangle( cxt, true, canvops.redNorthC, staObj.redMap.up );
                }
              } else {
                if (countdown <= 60) {
                  canvops.drawTriangle( cxt, false, canvops.redSouthC, staObj.redMap.sta );
                } else {
                  canvops.drawTriangle( cxt, false, canvops.redSouthC, staObj.redMap.dn );
                }
              }
              break;
              
            case "Dorchester":
              if (masstrac.trips[trip].heading >= 270 ||
                  masstrac.trips[trip].heading <= 90) {
                if (countdown <= 60) {
                  canvops.drawTriangle( cxt, true, canvops.redNorthA, staObj.redMap.sta );
                } else {
                  canvops.drawTriangle( cxt, true, canvops.redNorthA, staObj.redMap.up );
                }
              } else {
                if (countdown <= 60) {
                  canvops.drawTriangle( cxt, false, canvops.redSouthA, staObj.redMap.sta );
                } else {
                  canvops.drawTriangle( cxt, false, canvops.redSouthA, staObj.redMap.dn );
                }
              }
              break;
              
            case "Braintree":
              if (masstrac.trips[trip].heading >= 270 ||
                  masstrac.trips[trip].heading <= 90) {
                if (countdown <= 60) {
                  canvops.drawTriangle( cxt, true, canvops.redNorthB, staObj.redMap.sta );
                } else {
                  canvops.drawTriangle( cxt, true, canvops.redNorthB, staObj.redMap.up );
                }
              } else {
                if (countdown <= 60) {
                  canvops.drawTriangle( cxt, false, canvops.redSouthB, staObj.redMap.sta );
                } else {
                  canvops.drawTriangle( cxt, false, canvops.redSouthB, staObj.redMap.dn );
                }
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
          countdown = masstrac.trips[trip].Predictions[0].Countdown;
          
          // Determine which side to draw based on last-known heading East/West
          if (masstrac.trips[trip].heading >= 350 ||
              masstrac.trips[trip].heading <= 160) {
            // West Bound to Wonderland
            if (countdown <=60) {
              canvops.drawTriangle( cxt, true, canvops.blueEast, staObj.blueMap.sta );
            } else {
              canvops.drawTriangle( cxt, true, canvops.blueEast, staObj.blueMap.up );
            }
          } else {
            // East Bound to Government Center / Bowdoin
            if (countdown <= 60) {
              canvops.drawTriangle( cxt, false, canvops.blueWest, staObj.blueMap.sta );
            } else {
              canvops.drawTriangle( cxt, false, canvops.blueWest, staObj.blueMap.dn );
            }
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
          countdown = masstrac.trips[trip].Predictions[0].Countdown;
          
          if (masstrac.trips[trip].heading > 270 ||
              masstrac.trips[trip].heading < 90) {
            // North Bound
            if (countdown <= 60) {
              canvops.drawTriangle( cxt, true, canvops.orangeNorth, staObj.orangeMap.sta );
            } else {
              canvops.drawTriangle( cxt, true, canvops.orangeNorth, staObj.orangeMap.up );
            }
          } else {
            // South Bound
            if (countdown <= 60) {
              canvops.drawTriangle( cxt, false, canvops.orangeSouth, staObj.orangeMap.sta );
            } else {
              canvops.drawTriangle( cxt, false, canvops.orangeSouth, staObj.orangeMap.dn );
            }
          }
        }
      }
      break;

    default:
      return false;
  }
  
  return true;
};