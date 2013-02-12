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
 * What does this accomplish?
 * Well there's actually an upside to this conundrum, everyone that uses our
 * site will now use our cached copy of the MBTA arrival data, taking the load
 * off of their servers. If a refresh request comes to this script and the
 * cached JSON file is younger than 30 seconds old, then we'll just return and
 * let the AJAX call to our cached JSON go through, otherwise grab the latest.
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
// For our testing, we've set this to 1 minute.
$freezeTime = 60;

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
if ($siteRequest == "1") {
  $type = "commuter";
  
} else if ($siteRequest == "2") {
  $type = "commuter";
  
} else if ($siteRequest == "3") {
  $type = "commuter";
  
} else if ($siteRequest == "4") {
  $type = "commuter";
  
} else if ($siteRequest == "5") {
  $type = "commuter";
  
} else if ($siteRequest == "6") {
  $type = "commuter";
  
} else if ($siteRequest == "7") {
  $type = "commuter";
  
} else if ($siteRequest == "8") {
  $type = "commuter";
  
} else if ($siteRequest == "9") {
  $type = "commuter";
  
} else if ($siteRequest == "10") {
  $type = "commuter";
  
} else if ($siteRequest == "11") {
  $type = "commuter";
  
// Then give the subway a go...
} else if ($siteRequest == "12") {
  $type = "commuter";  
  
} else if ($siteRequest == "orange") {
  $type = "subway";  
  
} else if ($siteRequest == "red") {
  $type = "subway";  
  
} else if ($siteRequest == "blue") {
  $type = "subway";
  
// Oh dear, somebody sent something wrong.
} else {
  print "An invalid JSON file was specified. No Action.";
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

// Now that location of to-be-downloaded data has been determined, see if the
// file is even old-enough to need refreshing from upstream

$systemTime = time();
print "System Time: " . $systemTime . "<br>";
$cachedFileCTime = filectime($localCacheCopy);
print "File Change Time: " . $cachedFileCTime . "<br>";

if (($systemTime - $cachedFileCTime) < $freezeTime) {
  print "Locally-cached JSON file is sufficiently up-to-date ... no update." . "<br>";
  exit();
} else {
  print "Locally-cached JSON is old ... will attempt an update!" . "<br>";
}

print "Remote JSON source is: " . $remoteSource . "<br>";
print "Local JSON source is: " . $localCacheCopy . "<br>";

/*
 * CURL Initialization and run!
 */
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $remoteSource);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$page = curl_exec($curl);
curl_close($curl);

print "Successfully updated the MBTA JSON file for Line: " . $siteRequest . "<br>";

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
  echo "Cannot open file ($localCacheCopy)";
  exit();
}

if (fwrite($cachedCopyPtr, $page) === FALSE) {
  echo "Cannot write to file ($localCacheCopy)";
  exit;
}

fclose($cachedCopyPtr);
?>
