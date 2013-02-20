<?php
/*
 * Filename: mbtaALERTS.php
 * 
 * Programmer: Daniel Brook, UMass Lowell Student
 *             daniel_brook@student.uml.edu
 * 
 * 
 * 
 * NOTE: Much of this code comes from doing (mostly) the same task in the
 *       mbtaJSON.php file, which contains some lenghtier comments.
 */

/*
 * The freezeTime is a parameter that allows us to set a timeout between
 * caching a copy of the RSS feed for our users to see. The whole point of this
 * is to make life easier for the MBTA's servers while providing our users a
 * quicker page load (hopefully!)
 */
$freezeTime = 300;         // Time is in SECONDS.

/*
 * First we should make sure that these are being saved into the data
 * directory and not wherever PHP's current working directory is.
 * http://stackoverflow.com/questions/192092/in-php-best-way-to-ensure-current-working-directory-is-same-as-script-when-us
 */
chdir(dirname(__FILE__));

/*
 * Where is the file coming from? 
 * There's only one RSS feed, so this is easy!
 */
$remoteSource = "http://talerts.com/rssfeed/alertsrss.aspx";

/*
 * Where will the file go on the server?
 * Just place it with all the arrival JSONs.
 */
$localCacheCopy = "../data/alerts.xml";

/*
 * Compare the system time with the modified time of the cached RSS feed,
 * triggering an update from the MBTA if it's in excess of $freezeTime.
 */
$systemTime = time();
$cachedFileCTime = filectime($localCacheCopy);
print "Age of RSS feed is " . ($systemTime - $cachedFileCTime) . "sec<br />";

if (($systemTime - $cachedFileCTime) < $freezeTime) {
  print "Server-cached RSS feed is sufficiently up to date.<br />";
  exit();
}
print "Our copy of the RSS alerts feed is old, get a new one.<br />";

/*
 * CURL Initialization and run!
 */
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $remoteSource);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$page = curl_exec($curl);
curl_close($curl);

print "Successfully retrieved new RSS alert data from the MBTA.<br />";

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
