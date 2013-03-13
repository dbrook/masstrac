<?php
/*
 * Filename: mbtaJSON.php
 * 
 * Programmer: Daniel Brook, UMass Lowell Student
 *             daniel_brook@student.uml.edu
 * 
 * This server-side PHP script will essentially act as a "wrapper" for an AJAX
 * call to get JSON data from the MBTA. Since JavaScript requires everything
 * to happen within the same domain for security reasons, this is a workaround
 * to let us get the MBTA's JSON files which would otherwise be inaccessible.
 * 
 * This script has been updated to actually return the appropriate requested
 * JSON file to the calling AJAX. This will save a step by eliminating the need
 * to get the copy from the server seperately with another AJAX call. It's 
 * hoped that this will be faster!
 * 
 * NOTE: This will add a key/value pair to the MBTA JSON data indicating success
 * or failure: {"success": true, .... rest of MBTA data}
 * 
 * What does this accomplish?
 * Well there's actually an upside to this conundrum, everyone that uses our
 * site will now use our cached copy of the MBTA arrival data, taking the load
 * off of their servers.
 * 
 ****************************************************************************************
 * This page was created based upon a response found:
 * http://stackoverflow.com/questions/8271528/using-ajax-to-access-an-external-php-file
 ****************************************************************************************
 */

// The freezeTime is the number of seconds between allowing a pull of the
// JSON data from the MBTA. Their developer agreement says this cannot be
// more frequent than every 10 seconds.
//
// For our testing, we've set this to 59 seconds.
$freezeTime = 59;

/*
 * Input validation
 * In an attempt to hopefully make this secure, ONLY accept the following file
 * names to check:
 * RailLine_1.json, ... , RailLine_12.json, orange.json, red.json, blue.json
 * 
 * Arguments can be sent to this PHP script by using URL arguments a la:
 * blah.net/~whoisit/pub/scripts/test.php?c1="blah blah"?c2="false"
 * and you get an associative array back:
 * 
 * $_GET[c1  ] => "blah blah"
 * $_GET[c2  ] => "false"
 */

$siteRequest = $_GET[line];

// First validate Commuter Rail Line Numbers
if ($siteRequest == "1"  ||
    $siteRequest == "2"  ||
    $siteRequest == "3"  ||
    $siteRequest == "4"  ||
    $siteRequest == "5"  ||
    $siteRequest == "6"  ||
    $siteRequest == "7"  ||
    $siteRequest == "8"  ||
    $siteRequest == "9"  ||
    $siteRequest == "10" ||
    $siteRequest == "11" ||
    $siteRequest == "12"   ) {
  
  $type = "commuter";
  
} else if ($siteRequest == "orange" ||
           $siteRequest == "red"    ||
           $siteRequest == "blue"     ) {
  
  $type = "subway";  
  
} else {
  /*
   * No valid line was specified, so here's how we'll tell jQuery that a 
   * problem was encountered:
   * 
   * http://stackoverflow.com/questions/9193153/find-error-php-returns-to-ajax-in-jquery
   * 
   * Basically, as long as the PHP ran and completed, a "200 : SUCCESS" is
   * returned so we can't use the jQuery "error" function. 
   */
  $response = array( success => false );
  echo json_encode( $response );
  exit();
}

/*
 * Made it past the sanity checker? 
 * First we should make sure that these are being saved into the data
 * directory and not wherever the heck PHP starts in.
 * http://stackoverflow.com/questions/192092/in-php-best-way-to-ensure-current-working-directory-is-same-as-script-when-us
 */
chdir(dirname(__FILE__));

if ($type == "subway") {
  $remoteSource = "http://developer.mbta.com/lib/rthr/" .
                  $siteRequest . ".json";

  // Where to put the copied file (relative to script's directory)
  $localCacheCopy = "../data/" . $siteRequest . ".json";

} else {
  $remoteSource = "http://developer.mbta.com/lib/RTCR/RailLine_" .
                  $siteRequest . ".json";

  // Where to put the copied file (relative to script's directory)
  $localCacheCopy = "../data/RailLine_" . $siteRequest . ".json";
}

/*
 * Now that location of to-be-downloaded data has been determined, see if the
 * file is even old-enough to need refreshing from upstream.
 * 
 * If it is new enough, just give our JSON back, otherwise get a new one.
 */

$systemTime = time();
//print "System Time: " . $systemTime . "<br>";
$cachedFileCTime = filectime($localCacheCopy);
//print "File Change Time: " . $cachedFileCTime . "<br>";

if (($systemTime - $cachedFileCTime) < $freezeTime) {
//  print "Locally-cached JSON file is sufficiently up-to-date ... no update." . "<br>";
  
  // Just read in the locally-cached copy!
  // Thanks to: http://www.ibm.com/developerworks/library/os-php-readfiles/
  $page = file_get_contents($localCacheCopy);
  
  
} else {
//  print "Locally-cached JSON is old ... will attempt an update!" . "<br>";
//  print "Remote JSON source is: " . $remoteSource . "<br>";
//  print "Local JSON source is: " . $localCacheCopy . "<br>";

  /*
   * CURL Initialization and run!
   */
  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, $remoteSource);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  $page = curl_exec($curl);
  curl_close($curl);

//  print "Successfully updated the MBTA JSON file for Line: " . $siteRequest . "<br>";

  /*
   * Want to save the JSON data to a file (and obliterate the old one)
   *
   * http://stackoverflow.com/questions/1006604/saving-file-using-curl
   * http://php.net/manual/en/function.fopen.php
   * 
   * DEFINITELY not as simple as it sounds. Because the script is kind of running
   * as its own "thing", it needs to be allowed to read/write my own files.
   * http://www.programmingforums.org/thread17968.html
   * 
   * It won't overwrite existing files that I own, but it will make and update 
   * its own copies. So just give rwxrwxrwx (ugh, I know...) for now just to get
   * up and running in the ../data/ directory.
   * 
   * File write / open status checking code from:
   * http://forums.phpfreaks.com/topic/125161-solved-cant-write-to-a-file-on-local-server/
   */
  if (!$cachedCopyPtr = fopen($localCacheCopy, 'w')) {
//    echo "Cannot open file ($localCacheCopy)";
    $response = array(success => false);
    echo json_encode($response);
    exit();
  }

  if (fwrite($cachedCopyPtr, $page) === FALSE) {
//    echo "Cannot write to file ($localCacheCopy)";
    $response = array(success => false);
    echo json_encode($response);
    exit();
  }

  fclose($cachedCopyPtr);
}

/*
 * This is a pretty interesting approach. The JSON data we now have can actually
 * be returned to the AJAX call we used to check for an update. This means we
 * can actually skip the subsequent AJAX call to grab the JSON from the server.
 * This should save a significant (?) chunk of data transfer :-) !
 * 
 * Thanks to the PHP manual!
 * http://php.net/manual/en/function.array-merge.php
 */

// Break out the arrival data into a PHP array we can work with.
$arrivalData = json_decode( $page, true );

// Attach the success / fail information to it, then re-encode.
$success = array( success => true );
$response = array_merge( $success, $arrivalData );
echo json_encode( $response );
?>
