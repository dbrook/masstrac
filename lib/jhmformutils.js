/*  File:  ~dbrook/formutilities.js
 *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Copyright (c) 2009 by Jesse M. Heines.  All rights reserved.  May be freely 
 *    copied or excerpted for educational purposes with credit to the author.
 *  updated by JMH on January 31, 2002 at 05:06 PM
 *  updated by JMH on September 3, 2009 at 11:22 AM
 *  updated by JMH on November 10, 2012 at 7:27 PM
 * 
 *  This file contains the utility functions needed to perform pseudo form 
 *  processing.
 */


/** This function gets the value of a named parameter and returns a single
 *  string value or null if the named parameter does not exist.  
 *  
 *  If there is more than one parameter with the same name in the location.search 
 *  string, this function returns only the first one.  If you know that there 
 *  will be more than one parameter with the same name, use the getMultiParameter 
 *  function below instead of this one.
 *  
 *  Author:  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Revised: by JMH on January 31, 2002 at 11:56 AM
 *  Parameters:
 *     (1)  strName  the name of the parameter to extract
 *  Return Value:
 *     string  value of specified parameter or null if the parameter does not exist
 */
function getParameter( strName ) {
  // extract the address part starting at the "?"
  var strSearch = "" + location.search ;
  
  // find the location of the parameter name you're looking for
  var intStart = strSearch.indexOf( strName + "=" ) ;
  
  // make sure that parameter name is not part of a larger parameter name,
  // that is, a substring of a larger parameter name
  var boolOK = ( intStart > 0 ) && 
  ( strSearch.charAt( intStart-1 ) == "?" ||
    strSearch.charAt( intStart-1 ) == "&" ) ;
  
  // if the parameter is not found or is part of a larger parameter name, 
  // return null
  if ( ! boolOK ) {
    return null ;
  } else {  // else extract the parameter's value and return it
    // extract from the start of the value to the end of the entire search
    // string and append an ampersand to the end of the extract value string
    var strValue = 
    strSearch.substr( intStart + strName.length + 1 ) + "&" ;

    // find the position of the first ampersand in the value string
    // and return the substring ending at the first ampersand
    return strValue.substr( 0, strValue.indexOf( "&" ) ) ;
  }
}


/** This function gets the value(s) of a named parameter and returns an array
 *  of those values or null if the named parameter does not exist.  
 *  
 *  This function may always be used in place of the getParameter function above,
 *  but getParameter may be more convenient when you know that there is only one 
 *  parameter with the specified name.
 *  
 *  Author:  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Revised: by JMH on January 31, 2002 at 05:09 PM
 *  Parameters:
 *     (1)  strName  the name of the parameter to extract
 *  Return Value:
 *     array containing the string values of specified parameter or null if 
 *       the parameter does not exist
 */
function getMultiParameter( strName ) {
  // extract the address part starting at the "?"
  var strSearch = "" + location.search ;
  
  // find the location of the parameter name you're looking for
  var intStart = strSearch.indexOf( strName + "=" ) ;
  
  // make sure that parameter name is not part of a larger parameter name,
  // that is, a substring of a larger parameter name
  var boolOK = ( intStart > 0 ) && 
  ( strSearch.charAt( intStart-1 ) == "?" ||
    strSearch.charAt( intStart-1 ) == "&" ) ;
  
  // if the parameter is not found or is part of a larger parameter name, return null
  if ( ! boolOK ) {
    return null ;
  } else {  // else extract the parameter's value and return it
    var arrResult = new Array() ;  // array of strings to be returned
    var nResults = 0 ;             // number of string to be added
    
    while ( intStart > -1 ) {
      // extract from the start of the value to the end of the entire search string 
      // and append an ampersand to the end of the extract value string
      arrResult[nResults] = 
      strSearch.substr( intStart + strName.length + 1 ) + "&" ;

      // find the position of the first ampersand in the value string
      // and return the substring ending at the first ampersand
      arrResult[nResults] = arrResult[nResults].substr( 
        0, arrResult[nResults].indexOf( "&" ) ) ;
      
      // increment number of results and search again, but starting 
      // after the last match found
      nResults++ ;
      intStart = strSearch.indexOf( strName + "=" , intStart + 1 ) ;
    }
    
    // return the result array
    return arrResult ;
  }
}