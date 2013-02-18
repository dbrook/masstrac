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
    "Headway" : {
        "Weekdays" : {
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
    
    /*
     * The Stations array holds the names of all stations as
     * well as what branches serve those stations on weekdays,
     * Saturdays, and Sundays (because it fluctuates, of course).
     */
    "Stations" : [ {
        name : "Lechmere",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "Science Park",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "North Station",
        wkdbranch : [ 'c', 'e' ],
        satbranch : [ 'c', 'e' ],
        sunbranch : [ 'c', 'e' ]
    }, {
        name : "Haymarket",
        wkdbranch : [ 'c', 'e' ],
        satbranch : [ 'c', 'e' ],
        sunbranch : [ 'c', 'e' ]
    }, {
        name : "Government Center",
        wkdbranch : [ 'b', 'c', 'd', 'e' ],
        satbranch : [ 'b', 'c', 'd', 'e' ],
        sunbranch : [ 'b', 'c', 'd', 'e' ]
    }, {
        name : "Park Street",
        wkdbranch : [ 'b', 'c', 'd', 'e' ],
        satbranch : [ 'b', 'c', 'd', 'e' ],
        sunbranch : [ 'b', 'c', 'd', 'e' ]
    }, {
        name : "Boylston",
        wkdbranch : [ 'b', 'c', 'd', 'e' ],
        satbranch : [ 'b', 'c', 'd', 'e' ],
        sunbranch : [ 'b', 'c', 'd', 'e' ]
    }, {
        name : "Arlington",
        wkdbranch : [ 'b', 'c', 'd', 'e' ],
        satbranch : [ 'b', 'c', 'd', 'e' ],
        sunbranch : [ 'b', 'c', 'd', 'e' ]
    }, {
        name : "Copley",
        wkdbranch : [ 'b', 'c', 'd', 'e' ],
        satbranch : [ 'b', 'c', 'd', 'e' ],
        sunbranch : [ 'b', 'c', 'd', 'e' ]
    }, {
        name : "Hynes Convention Center",
        wkdbranch : [ 'b', 'c', 'd' ],
        satbranch : [ 'b', 'c', 'd' ],
        sunbranch : [ 'b', 'c', 'd' ]
    }, {
        name : "Kenmore",
        wkdbranch : [ 'b', 'c', 'd' ],
        satbranch : [ 'b', 'c', 'd' ],
        sunbranch : [ 'b', 'c', 'd' ]
    }, {
        name : "Blandford St",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Boston University East",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Boston University Central",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Boston University West",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "St. Paul St (B)",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Pleasant St",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Babcock St",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Packards Corner",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Harvard Ave",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Griggs St - Long Ave",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Allston St",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Warren St",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Washington St",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Sutherland Rd",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Chiswick Rd",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Chestnut Hill Ave",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "South St",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "Boston College",
        wkdbranch : [ 'b' ],
        satbranch : [ 'b' ],
        sunbranch : [ 'b' ]
    }, {
        name : "St. Marys St",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Hawes St",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Kent St",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "St. Paul St (C)",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Coolidge Corner",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Summit Ave",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Brandon Hall",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Fairbanks",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Washington Square",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Tappan St",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Dean Rd",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Englewood Ave",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Cleveland Circle",
        wkdbranch : [ 'c' ],
        satbranch : [ 'c' ],
        sunbranch : [ 'c' ]
    }, {
        name : "Fenway",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Longwood",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Brookline Village",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Brookline Hills",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Beaconsfield",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Reservoir",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Chestnut Hill",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Newton Centre",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Newton Highlands",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Eliot",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Waban",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Woodland",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Riverside",
        wkdbranch : [ 'd' ],
        satbranch : [ 'd' ],
        sunbranch : [ 'd' ]
    }, {
        name : "Prudential",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "Symphony",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "Northeastern University",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "Museum of Fine Arts",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "Longwood Medical",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "Brigham Circle",
        wkdbranch : [ 'e' ],
        satbranch : [ 'e' ],
        sunbranch : [ 'e' ]
    }, {
        name : "Fenwood Rd",
        wkdbranch : [ 'e' ],
        satbranch : [  ],
        sunbranch : [  ]
    }, {
        name : "Mission Park",
        wkdbranch : [ 'e' ],
        satbranch : [  ],
        sunbranch : [  ]
    }, {
        name : "Riverway",
        wkdbranch : [ 'e' ],
        satbranch : [  ],
        sunbranch : [  ]
    }, {
        name : "Back of the Hill",
        wkdbranch : [ 'e' ],
        satbranch : [  ],
        sunbranch : [  ]
    }, {
        name : "Heath Street",
        wkdbranch : [ 'e' ],
        satbranch : [  ],
        sunbranch : [  ]
    } ]
};
