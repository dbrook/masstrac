/* 
 * Filename: green.json
 * 
 * Author: Daniel Brook
 * 
 * Adapted from data available from the MBTA at http://www.mbta.com/
 * 
 * This file contains the approximate headways for the MBTA Green Line service
 * organized by the time of day that the headways apply. The groupings are
 * done in the following timeframes (for all days). 
 *   Early:    4:30 AM -  6:30 AM
 *   AMRush:   6:30 AM -  9:00 AM
 *   Midday:   9:00 AM -  3:30 PM
 *   PMRush:   3:30 PM -  6:30 PM
 *   Evening:  6:30 PM -  8:00 PM
 *   Late:     8:00 PM - 12:30 AM
 * 
 * When using this file, it's up to the implementer to determine which of the
 * service modes to ask for based on the current time.
 * 
 * Aside from the headways under the "routes" tree, there is also the list
 * of stations and which lettered branches stop at them based on weekday, 
 * Saturday, and Sunday services (because the "E Line" only runs to Brigham
 * Circle on the weekends, it was deemed worthwhile to provide a mechanism
 * to "turn" stops "on and off", also the various branches have historically
 * varied due mostly to the Big Dig, but also in the future when MassDOT
 * finishes the Somerville extension to the Green Line, it's unclear which
 * branch will continue into Somerville, see wiki for details).
 * 
 *                        http://en.wikipedia.org/wiki/Lechmere_(MBTA_station)
 *                        http://en.wikipedia.org/wiki/Green_Line_(MBTA)
 * 
 * Wait a minute, why isn't this automated like the Blue, Orange, and Red?
 * 
 * It's a boring story, actually: the Green Line doesn't have vehicle tracking
 * because of its historical burden of being one of the oldest transit 
 * routes in the United States. Automatic tracking data is expected to be
 * implemented in the [near? 2~ish years?]. This data source is therefore
 * used as a stop-gap measure to provide "expected" wait times that the line
 * should be run on.
 */

masstrac.green = {
    /* 
     * The integer values listed below are the headways in minutes
     * east_term is the eastern terminus of the branch
     * west_term is the western terminus of the branch
     */
    
    "headway" : {
        "Weekday" : {
            b : {
                "east_term" : "Government Center",
                "west_term" : "Boston College",
                "Early" :    9,
                "AMRush" :   6,
                "Midday" :   9,
                "PMRush" :   6,
                "Evening" : 10,
                "Late" :    11
            },
            c : {
                "east_term" : "North Station",
                "west_term" : "Cleveland Circle",
                "Early" :   10,
                "AMRush" :   7,
                "Midday" :  10,
                "PMRush" :   7,
                "Evening" :  7,
                "Late" :    14
            },
            d : {
                "east_term" : "Government Center",
                "west_term" : "Riverside",
                "Early" :   11,
                "AMRush" :   6,
                "Midday" :  11,
                "PMRush" :   6,
                "Evening" : 10,
                "Late" :    13
            },
            e : {
                "east_term" : "Lechmere",
                "west_term" : "Heath Street",
                "Early" :    8,
                "AMRush" :   6,
                "Midday" :   8,
                "PMRush" :   6,
                "Evening" : 10,
                "Late" :    14
            }
        },
        "Saturday" : {
            b : {
                "east_term" : "Government Center",
                "west_term" : "Boston College",
                "Early" :    7,
                "AMRush" :   7,
                "Midday" :   7,
                "PMRush" :   7,
                "Evening" :  7,
                "Late" :    11
            },
            c : {
                "east_term" : "North Station",
                "west_term" : "Cleveland Circle",
                "Early" :   10,
                "AMRush" :  10,
                "Midday" :  10,
                "PMRush" :   8,
                "Evening" :  8,
                "Late" :    10
            },
            d : {
                "east_term" : "Government Center",
                "west_term" : "Riverside",
                "Early" :   10,
                "AMRush" :  10,
                "Midday" :  10,
                "PMRush" :   7,
                "Evening" : 10,
                "Late" :    10
            },
            e : {
                "east_term" : "Lechmere",
                "west_term" : "Brigham Circle",
                "Early" :   10,
                "AMRush" :  10,
                "Midday" :  10,
                "PMRush" :   7,
                "Evening" : 10,
                "Late" :    10
            }
        },
        "Sunday" : {
            b : {
                "east_term" : "Government Center",
                "west_term" : "Boston College",
                "Early" :   10,
                "AMRush" :  10,
                "Midday" :  10,
                "PMRush" :   9,
                "Evening" : 10,
                "Late" :    10
            },
            c : {
                "east_term" : "North Station",
                "west_term" : "Cleveland Circle",
                "Early" :   10,
                "AMRush" :  10,
                "Midday" :  10,
                "PMRush" :  10,
                "Evening" : 10,
                "Late" :    10
            },
            d : {
                "east_term" : "Government Center",
                "west_term" : "Riverside",
                "Early" :   10,
                "AMRush" :  10,
                "Midday" :  10,
                "PMRush" :  10,
                "Evening" : 10,
                "Late" :    10
            },
            e : {
                "east_term" : "Lechmere",
                "west_term" : "Brigham Circle",
                "Early" :   12,
                "AMRush" :  12,
                "Midday" :  12,
                "PMRush" :  10,
                "Evening" : 12,
                "Late" :    12
            }
        }
    },
    
    "stations" : {
        "Weekdays" : {
            "Lechmere" : ['e'],
            "Science Park" : ['e'],
            "North Station" : ['c', 'e'],
            "Haymarket" : ['c', 'e'],
            "Government Center" : ['b', 'c', 'd', 'e'],
            "Park Street" : ['b', 'c', 'd', 'e'],
            "Boylston" : ['b', 'c', 'd', 'e'],
            "Arlington" : ['b', 'c', 'd', 'e'],
            "Copley" : ['b', 'c', 'd', 'e'],
            "Hynes Convention Center" : ['b', 'c', 'd'],
            "Kenmore" : ['b', 'c', 'd'],
            "Blandford St" : ['b'],
            "Boston University East" : ['b'],
            "Boston University Central" : ['b'],
            "Boston University West" : ['b'],
            "St. Paul St (B)" : ['b'],
            "Pleasant St" : ['b'],
            "Babcock St" : ['b'],
            "Packards Corner" : ['b'],
            "Harvard Ave" : ['b'],
            "Griggs St - Long Ave" : ['b'],
            "Allston St" : ['b'],
            "Warren St" : ['b'],
            "Washington St" : ['b'],
            "Sutherland Rd" : ['b'],
            "Chiswick Rd" : ['b'],
            "Chestnut Hill Ave" : ['b'],
            "South St" : ['b'],
            "Boston College" : ['b'],
            "St. Marys St" : ['c'],
            "Hawes St" : ['c'],
            "Kent St" : ['c'],
            "St. Paul St (C)" : ['c'],
            "Coolidge Corner" : ['c'],
            "Summit Ave" : ['c'],
            "Brandon Hall" : ['c'],
            "Fairbanks" : ['c'],
            "Washington Square" : ['c'],
            "Tappan St" : ['c'],
            "Dean Rd" : ['c'],
            "Englewood Ave" : ['c'],
            "Cleveland Circle" : ['c'],
            "Fenway" : ['d'],
            "Longwood" : ['d'],
            "Brookline Village" : ['d'],
            "Brookline Hills" : ['d'],
            "Beaconsfield" : ['d'],
            "Reservoir" : ['d'],
            "Chestnut Hill" : ['d'],
            "Newton Centre" : ['d'],
            "Newton Highlands" : ['d'],
            "Eliot" : ['d'],
            "Waban" : ['d'],
            "Woodland" : ['d'],
            "Riverside" : ['d'],
            "Prudential" : ['e'],
            "Symphony" : ['e'],
            "Northeastern University" : ['e'],
            "Museum of Fine Arts" : ['e'],
            "Longwood Medical" : ['e'],
            "Brigham Circle" : ['e'],
            "Fenwood Rd" : ['e'],
            "Mission Park" : ['e'],
            "Riverway" : ['e'],
            "Back of the Hill" : ['e'],
            "Heath Street" : ['e']
        },
        "Saturday" : {
            "Lechmere" : ['e'],
            "Science Park" : ['e'],
            "North Station" : ['c', 'e'],
            "Haymarket" : ['c', 'e'],
            "Government Center" : ['b', 'c', 'd', 'e'],
            "Park Street" : ['b', 'c', 'd', 'e'],
            "Boylston" : ['b', 'c', 'd', 'e'],
            "Arlington" : ['b', 'c', 'd', 'e'],
            "Copley" : ['b', 'c', 'd', 'e'],
            "Hynes Convention Center" : ['b', 'c', 'd'],
            "Kenmore" : ['b', 'c', 'd'],
            "Blandford St" : ['b'],
            "Boston University East" : ['b'],
            "Boston University Central" : ['b'],
            "Boston University West" : ['b'],
            "St. Paul St (B)" : ['b'],
            "Pleasant St" : ['b'],
            "Babcock St" : ['b'],
            "Packards Corner" : ['b'],
            "Harvard Ave" : ['b'],
            "Griggs St - Long Ave" : ['b'],
            "Allston St" : ['b'],
            "Warren St" : ['b'],
            "Washington St" : ['b'],
            "Sutherland Rd" : ['b'],
            "Chiswick Rd" : ['b'],
            "Chestnut Hill Ave" : ['b'],
            "South St" : ['b'],
            "Boston College" : ['b'],
            "St. Marys St" : ['c'],
            "Hawes St" : ['c'],
            "Kent St" : ['c'],
            "St. Paul St (C)" : ['c'],
            "Coolidge Corner" : ['c'],
            "Summit Ave" : ['c'],
            "Brandon Hall" : ['c'],
            "Fairbanks" : ['c'],
            "Washington Square" : ['c'],
            "Tappan St" : ['c'],
            "Dean Rd" : ['c'],
            "Englewood Ave" : ['c'],
            "Cleveland Circle" : ['c'],
            "Fenway" : ['d'],
            "Longwood" : ['d'],
            "Brookline Village" : ['d'],
            "Brookline Hills" : ['d'],
            "Beaconsfield" : ['d'],
            "Reservoir" : ['d'],
            "Chestnut Hill" : ['d'],
            "Newton Centre" : ['d'],
            "Newton Highlands" : ['d'],
            "Eliot" : ['d'],
            "Waban" : ['d'],
            "Woodland" : ['d'],
            "Riverside" : ['d'],
            "Prudential" : ['e'],
            "Symphony" : ['e'],
            "Northeastern University" : ['e'],
            "Museum of Fine Arts" : ['e'],
            "Longwood Medical" : ['e'],
            "Brigham Circle" : ['e'],
            "Fenwood Rd" : [],
            "Mission Park" : [],
            "Riverway" : [],
            "Back of the Hill" : [],
            "Heath Street" : []
        },
        "Sunday" : {
            "Lechmere" : ['e'],
            "Science Park" : ['e'],
            "North Station" : ['c', 'e'],
            "Haymarket" : ['c', 'e'],
            "Government Center" : ['b', 'c', 'd', 'e'],
            "Park Street" : ['b', 'c', 'd', 'e'],
            "Boylston" : ['b', 'c', 'd', 'e'],
            "Arlington" : ['b', 'c', 'd', 'e'],
            "Copley" : ['b', 'c', 'd', 'e'],
            "Hynes Convention Center" : ['b', 'c', 'd'],
            "Kenmore" : ['b', 'c', 'd'],
            "Blandford St" : ['b'],
            "Boston University East" : ['b'],
            "Boston University Central" : ['b'],
            "Boston University West" : ['b'],
            "St. Paul St (B)" : ['b'],
            "Pleasant St" : ['b'],
            "Babcock St" : ['b'],
            "Packards Corner" : ['b'],
            "Harvard Ave" : ['b'],
            "Griggs St - Long Ave" : ['b'],
            "Allston St" : ['b'],
            "Warren St" : ['b'],
            "Washington St" : ['b'],
            "Sutherland Rd" : ['b'],
            "Chiswick Rd" : ['b'],
            "Chestnut Hill Ave" : ['b'],
            "South St" : ['b'],
            "Boston College" : ['b'],
            "St. Marys St" : ['c'],
            "Hawes St" : ['c'],
            "Kent St" : ['c'],
            "St. Paul St (C)" : ['c'],
            "Coolidge Corner" : ['c'],
            "Summit Ave" : ['c'],
            "Brandon Hall" : ['c'],
            "Fairbanks" : ['c'],
            "Washington Square" : ['c'],
            "Tappan St" : ['c'],
            "Dean Rd" : ['c'],
            "Englewood Ave" : ['c'],
            "Cleveland Circle" : ['c'],
            "Fenway" : ['d'],
            "Longwood" : ['d'],
            "Brookline Village" : ['d'],
            "Brookline Hills" : ['d'],
            "Beaconsfield" : ['d'],
            "Reservoir" : ['d'],
            "Chestnut Hill" : ['d'],
            "Newton Centre" : ['d'],
            "Newton Highlands" : ['d'],
            "Eliot" : ['d'],
            "Waban" : ['d'],
            "Woodland" : ['d'],
            "Riverside" : ['d'],
            "Prudential" : ['e'],
            "Symphony" : ['e'],
            "Northeastern University" : ['e'],
            "Museum of Fine Arts" : ['e'],
            "Longwood Medical" : ['e'],
            "Brigham Circle" : ['e'],
            "Fenwood Rd" : [],
            "Mission Park" : [],
            "Riverway" : [],
            "Back of the Hill" : [],
            "Heath Street" : []
        }
    }
};
