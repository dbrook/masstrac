/* 
 * Pulls the staions from the stations.json file and creates local arrays out of them
 * also sets up the auto complete search bar and fills out the content of the accordion
 */

$(function getstations() {
                
  /*
   * Define station arrays
   */
  var stations = [];
  var red_line = [];
  var orange_line = [];
  var blue_line = [];
  var green_line = [];
  var purple_line =[];
                
  var i = 0;
  var j = 0;
                
  /*
   * For loop to populate station arrays
   * stations contains all the station names
   * red_line contains only the red line stations
   * orange_line contains the orange stations ect.
   */
  for (i=0; i<masstrac.stations.length; i++) {
    stations.push(masstrac.stations[i].name);
                    
    for (j=0; j<masstrac.stations[i].svcs.length; j++) {
      if (masstrac.stations[i].svcs[j] == "red") {
        red_line.push(masstrac.stations[i].name);
      } else if (masstrac.stations[i].svcs[j] == "orange") {
        orange_line.push(masstrac.stations[i].name);
      } else if (masstrac.stations[i].svcs[j] == "blue") {
        blue_line.push(masstrac.stations[i].name);
      }
      else if (masstrac.stations[i].svcs[j] == "green") {
        green_line.push(masstrac.stations[i].name);
      } else {
        purple_line.push(masstrac.stations[i].name);
        break;
      }
    }
  }   
        
        
  /* 
   * sort staions alphabetically 
   */      
  stations.sort();
  red_line.sort();
  orange_line.sort();
  blue_line.sort();
  green_line.sort();
  purple_line.sort();
        
        

  /*
   * jQuery call to give the seach bar its autocomplete tags
   */
  $( "#tags" ).autocomplete({
    source: stations,
    select: function(event, ui) {
                        
                        
      /*
       * See if there is a way to make these with RELATIVE links?
       */

      window.location = 
      "http://weblab.cs.uml.edu/~dbrook/masstrac/arrivals.html?name=" + ui.item.value;
    }
  });
  /*
   * Create vars for the lists of links that will be placed into the 
   * accordion content panels
   */
  var redlist = $("<ul></ul>").attr('id','redlinks');
  var orangelist = $("<ul></ul>").attr('id','orangelinks');
  var bluelist = $("<ul></ul>").attr('id','bluelinks');
  var greenlist = $("<ul></ul>").attr('id','greenlinks');
  var commuterlist = $("<ul></ul>").attr('id','commuterlinks');
            
  /*
   * Loop through the reds staion list
   * create link for each station
   * append the list to the correct content panel
   */
  for (i=0; i<red_line.length; i++) {
    redlist.append("<li><a href='arrivals.html?name=" + 
      red_line[i] + "'>" + red_line[i] + "</a>");
  }
  $("#r_content").append(redlist);
  for (i=0; i<orange_line.length; i++) {
    orangelist.append("<li><a href='arrivals.html?name=" + 
      orange_line[i] + "'>" + orange_line[i] + "</a>");
  }
  $("#o_content").append(orangelist);
            
  for (i=0; i<blue_line.length; i++) {
    bluelist.append("<li><a href='arrivals.html?name=" + 
      blue_line[i] + "'>" + blue_line[i] + "</a>");
  }
  $("#b_content").append(bluelist);
            
  for (i=0; i<green_line.length; i++) {
    greenlist.append("<li><a href='arrivals.html?name=" + 
      green_line[i] + "'>" + green_line[i] + "</a>");
  }
  $("#g_content").append(greenlist);
            
  for (i=0; i<purple_line.length; i++) {
    commuterlist.append("<li><a href='arrivals.html?name=" + 
      purple_line[i] + "'>" + purple_line[i] + "</a>");
  }
  $("#c_content").append(commuterlist);
        
        
});
        
        
/* 
 * This fuction transforms the accordion div into an accordion using jQuery ui
 * collapsible: true allows the accordian to be completely colapsed
 * activ: false loads the accordion with header active
 * heightStyle: "content" allows the content window height be unique to its content 
 */
$(function createAccordion() {
  $( "#accordion" ).accordion({
    collapsible: true, 
    active: false, 
    heightStyle: "content"
  });
});


/* variable to keep track of the map state
 * 
 *  0 = normal map
 *  1 = redline
 *  2 = orangeline
 *  3 = blueline
 *  4 = greenline
 *  5 = purpleline
 */
var map_state = 0;
/* Load images on document load to avoid glitches */
var redmap = new Image();
redmap.src = "img/maps/redline.png";
var orangemap = new Image();
orangemap.src = "img/maps/orangeline.png";
var bluemap = new Image();
bluemap.src = "img/maps/blueline.png";
var greenmap = new Image();
greenmap.src = "img/maps/greenline.png";
var purplemap = new Image();
purplemap.src = "img/maps/purpleline.png";


/* Map changeing functionality on click */
$(function map_change() {
  $("#r_header").click(function(){
    if (map_state != 1) {
      $("#map_img").attr('src',"img/maps/redline.png");  
      map_state = 1;
    } else {
      $("#map_img").attr('src',"img/maps/subway-spider.jpg"); 
      map_state = 0;
    }    
  });
  $("#o_header").click(function(){
    if (map_state != 2) {
      $("#map_img").attr('src',"img/maps/orangeline.png");
      map_state = 2;
    } else {
      $("#map_img").attr('src',"img/maps/subway-spider.jpg");
      map_state = 0;
    }    
  });
  $("#b_header").click(function(){
    if (map_state != 3) {
      $("#map_img").attr('src',"img/maps/blueline.png");
      map_state = 3;
    } else {
      $("#map_img").attr('src',"img/maps/subway-spider.jpg");
      map_state = 0;
    }    
  });
  $("#g_header").click(function(){
    if (map_state != 4) {
      $("#map_img").attr('src',"img/maps/greenline.png");
      map_state = 4
    } else {
      $("#map_img").attr('src',"img/maps/subway-spider.jpg");
      map_state = 0;
    }    
  });
  $("#c_header").click(function(){
    if (map_state != 5) {
      $("#map_img").attr('src',"img/maps/purpleline.png");
      map_state = 5;
    } else {
      $("#map_img").attr('src',"img/maps/subway-spider.jpg");
      map_state = 0;
    }    
  });
});
            