/* 
 * Filename: stations.js
 * 
 * Author: Daniel Brook
 * 
 * Last Updated: 2013-02-19 at  9:45 AM
 * 
 * Adapted from data available from the MBTA at 
 *    http://www.mbta.com/rider_tools/developers/default.asp?id=21899
 *    http://www.mbta.com/rider_tools/developers/default.asp?id=21898
 *    http://www.mbta.com/rider_tools/developers/default.asp?id=21895
 * 
 * This file contains all the rail stations in the MBTA system, what service
 * stops at each one (Commuter Rail, by line), Subway by line, and buses.
 * 
 * The motivation for doing this was to allow our apps to show information
 * for connecting services in one unified manner. For example: Haverhill Line
 * trains stop at Malden Center, which is also an Orange Line stop. Somebody
 * looking at the web-app may wish to know all available inbound services if
 * they're headed to North Station. Taking a Commuter Rail train if one was
 * "close enough" would cost the same subway fare, and would be a possibly
 * quicker ride to downtown.
 * 
 * Unfortunately there is a degree of "reinventing the wheel" going on here,
 * but unified naming is necessary to allow all services at a stop be listed
 * on whatever interface is programmed to display this data.
 * 
 ***************************************************************************
 * Additionally, when the Green Line is tracked in 2015, the JSON data feed
 * will probably use different naming than the naming used here, which just
 * matches the naming used in our green.json file that details the various
 * branches and their headways used to generate average wait times.
 ***************************************************************************
 * 
 * Future stations that haven't been added yet:
 * Assembly Square [orange], All Green Line Extension stations, Blue Line
 * extensions that may-or-may-not happen, SL5 through-routed to South Station,
 * Nashua, NH, Manchester, NH / Manchester-Boston Regional Airport, Fairmount
 * Line infill stations.
 *
 * SERVICE NOMENCLATURE:
 *   "red" -- The Red Line
 *   "green" -- The Green Line
 *   "blue" -- The Blue Line
 *   "orange" -- The Orange Line
 * 
 *   "n_station" -- North Station (Terminal, use separate departure board)
 *   "s_station" -- South Station (Terminal, use separate departure board)
 * 
 *   "fitchburg" -- Fitchburg / South Acton C.R.
 *   "haverhill" -- Haverhill / Reading C.R.
 *   "prov_stough" -- Providence / TF Green / Wickford Jct / Stoughton C.R.
 *   "worcester" -- Framingham / Worcester C.R.
 *   "needham" -- Needham C.R.
 *   "franklin" -- Franklin C.R.
 *   "king_plym" -- Kingston / Plymouth C.R.
 *   "middleborough" -- Middleborough / Lakeville C.R.
 *   "greenbush" -- Greenbush Line
 *   "fairmount" -- Fairmount C.R. / "Indigo Line"
 *   "newb_rock" -- Newburyport / Rockport C.R.
 *   "lowell" -- Lowell C.R.
 * 
 * One final brain teaser is that certain trips run partially on other 
 * lines. There are only 4 lines that cross paths on the Commuter Rail, 
 * and they are the Lowell Line and 
 * According to the Developer Guide, trips that share the Lowell and
 * Haverhill Lines are considered Haverhill trips, and trips that share
 * the Fairmount and Franklin Line tracks are considered Franklin Line
 * trips. As a result, these services have been added as necessary.
 */

masstrac.stations =
    /*
     * Start with the Green Line first.
     */
    [
        {
            name : "Lechmere",
            svcs : ["green"],
            bus : [69, 80, 87, 88],
            lat : 42.370772,
            lon : -71.076536
        },
        { 
            name : "Science Park", 
            svcs : ["green"],
            bus : [],
            lat : 42.366664,
            lon : -71.067666
        },
        {
            name : "North Station",
            svcs : ["green", "orange", "n_station"],
            bus : [4],
            lat : 42.365577,
            lon : -71.06129,
            orangeMap : {
              up : 173,
              dn : 148,
              sta: 158
            }
        },
        {
            name : "Haymarket",
            svcs : ["green", "orange"],
            bus : [92, 93, 111, 325, 326, 352, 354, 424, 426, 428, 441, 442, 449, 450, 455],
            lat : 42.363021,
            lon : -71.05829,
            orangeMap : {
              up : 197,
              dn : 173,
              sta: 184
            }
        },
        {
            name : "Government Center",
            svcs : ["green", "blue"],
            bus : [],
            lat : 42.359705,
            lon : -71.059215
        },
        {
            name : "Park Street",
            svcs : ["green", "red"],
            bus : [43, 55],
            lat : 42.35639457,
            lon : -71.0624242
        },
        {
            name : "Boylston",
            svcs : ["green"],
            bus : ["SL5"],
            lat : 42.35302,
            lon : -71.06459
        },
        {
            name : "Arlington",
            svcs : ["green"],
            bus : [9],
            lat : 42.351902,
            lon : -71.070893
        },
        {
            name : "Copley",
            svcs : ["green"],
            bus : [9, 10, 39, 55, 352, 502, 503, 504],
            lat : 42.349974,
            lon : -71.077447
        },
        {
            name : "Hynes Convention Center",
            svcs : ["green"],
            bus : [1, 55, "CT1"],
            lat : 42.347888,
            lon : -71.087903
        },
        {
            name : "Kenmore",
            svcs : ["green"],
            bus : [8, 57, 60, 65, 19],
            lat : 42.348949,
            lon : -71.095169
        },
        {
            name : "Blandford St",
            svcs : ["green"],
            bus : [],
            lat : 42.349293,
            lon : -71.100258
        },
        {
            name : "Boston University East",
            svcs : ["green"],
            bus : [],
            lat : 42.349735,
            lon : -71.103889
        },
        {
            name : "Boston University Central",
            svcs : ["green"],
            bus : [47],
            lat : 42.350082,
            lon : -71.106865
        },
        {
            name : "Boston University West",
            svcs : ["green"],
            bus : [47, 57, 193, "CT2"],
            lat : 42.350941,
            lon : -71.113876
        },
        {
            name : "St. Paul St (B)",
            svcs : ["green"],
            bus : [57],
            lat : 42.3512,
            lon : -71.116104
        },
        {
            name : "Pleasant St",
            svcs : ["green"],
            bus : [],
            lat : 42.351521,
            lon : -71.118889
        },
        {
            name : "Babcock St",
            svcs : ["green"],
            bus : [],
            lat : 42.35182,
            lon : -71.12165
        },
        {
            name : "Packards Corner",
            svcs : ["green"],
            bus : [57],
            lat : 42.351967,
            lon : -71.125031
        },
        {
            name : "Harvard Ave",
            svcs : ["green"],
            bus : [66],
            lat : 42.350243,
            lon : -71.131355
        },
        {
            name : "Griggs St - Long Ave",
            svcs : ["green"],
            bus : [],
            lat : 42.348545,
            lon : -71.134949
        },
        {
            name : "Allston St",
            svcs : ["green"],
            bus : [],
            lat : 42.348701,
            lon : -71.137955
        },
        {
            name : "Warren St",
            svcs : ["green"],
            bus : [],
            lat : 42.348343,
            lon : -71.140457
        },
        {
            name : "Washington St",
            svcs : ["green"],
            bus : [65],
            lat : 42.343864,
            lon : -71.142853
        },
        {
            name : "Sutherland Rd",
            svcs : ["green"],
            bus : [],
            lat : 42.341614,
            lon : -71.146202
        },
        {
            name : "Chiswick Rd",
            svcs : ["green"],
            bus : [],
            lat : 42.340805,
            lon : -71.150711
        },
        {
            name : "Chestnut Hill Ave",
            svcs : ["green"],
            bus : [51, 86],
            lat : 42.338169,
            lon : -71.15316
        },
        {
            name : "South St",
            svcs : ["green"],
            bus : [],
            lat : 42.3396,
            lon : -71.157661
        },
        {
            name : "Boston College",
            svcs : ["green"],
            bus : [],
            lat : 42.340081,
            lon : -71.166769
        },
        {
            name : "St. Marys St",
            svcs : ["green"],
            bus : ["CT2"],
            lat : 42.345974,
            lon : -71.107353
        },
        {
            name : "Hawes St",
            svcs : ["green"],
            bus : [],
            lat : 42.344906,
            lon : -71.111145
        },
        {
            name : "Kent St",
            svcs : ["green"],
            bus : [],
            lat : 42.344074,
            lon : -71.114197
        },
        {
            name : "St. Paul St (C)",
            svcs : ["green"],
            bus : [],
            lat : 42.343327,
            lon : -71.116997
        },
        {
            name : "Coolidge Corner",
            svcs : ["green"],
            bus : [66],
            lat : 42.342213,
            lon : -71.121201
        },
        {
            name : "Summit Ave",
            svcs : ["green"],
            bus : [],
            lat : 42.34111,
            lon : -71.12561
        },
        {
            name : "Brandon Hall",
            svcs : ["green"],
            bus : [],
            lat : 42.340023,
            lon : -71.129082
        },
        {
            name : "Fairbanks",
            svcs : ["green"],
            bus : [],
            lat : 42.339725,
            lon : -71.131073
        },
        {
            name : "Washington Square",
            svcs : ["green"],
            bus : [65],
            lat : 42.339394,
            lon : -71.13533
        },
        {
            name : "Tappan St",
            svcs : ["green"],
            bus : [],
            lat : 42.338459,
            lon : -71.138702
        },
        {
            name : "Dean Rd",
            svcs : ["green"],
            bus : [],
            lat : 42.337807,
            lon : -71.141853
        },
        {
            name : "Englewood Ave",
            svcs : ["green"],
            bus : [],
            lat : 42.336971,
            lon : -71.14566
        },
        {
            name : "Cleveland Circle",
            svcs : ["green"],
            bus : [51, 86],
            lat : 42.336142,
            lon : -71.149326
        },
        {
            name : "Fenway",
            svcs : ["green"],
            bus : [47, "CT2"],
            lat : 42.345394,
            lon : -71.104187
        },
        {
            name : "Longwood",
            svcs : ["green"],
            bus : [],
            lat : 42.341145,
            lon : -71.110451
        },
        {
            name : "Brookline Village",
            svcs : ["green"],
            bus : [39, 60, 65, 66],
            lat : 42.332774,
            lon : -71.116296
        },
        {
            name : "Brookline Hills",
            svcs : ["green"],
            bus : [60],
            lat : 42.331333,
            lon : -71.126999
        },
        {
            name : "Beaconsfield",
            svcs : ["green"],
            bus : [],
            lat : 42.335846,
            lon : -71.140823
        },
        {
            name : "Reservoir",
            svcs : ["green"],
            bus : [51, 86],
            lat : 42.335027,
            lon : -71.148952
        },
        {
            name : "Chestnut Hill",
            svcs : ["green"],
            bus : [],
            lat : 42.326653,
            lon : -71.165314
        },
        {
            name : "Newton Centre",
            svcs : ["green"],
            bus : [52],
            lat : 42.329391,
            lon : -71.192429
        },
        {
            name : "Newton Highlands",
            svcs : ["green"],
            bus : [59],
            lat : 42.321735,
            lon : -71.206116
        },
        {
            name : "Eliot",
            svcs : ["green"],
            bus : [59],
            lat : 42.319023,
            lon : -71.216713
        },
        {
            name : "Waban",
            svcs : ["green"],
            bus : [],
            lat : 42.325943,
            lon : -71.230728
        },
        {
            name : "Woodland",
            svcs : ["green"],
            bus : [],
            lat : 42.333374,
            lon : -71.244301
        },
        {
            name : "Riverside",
            svcs : ["green"],
            bus : [558],
            lat : 42.337059,
            lon : -71.251742
        },
        {
            name : "Prudential",
            svcs : ["green"],
            bus : [39],
            lat : 42.34557,
            lon : -71.081696
        },
        {
            name : "Symphony",
            svcs : ["green"],
            bus : [1, 39, "CT1"],
            lat : 42.342687,
            lon : -71.085056
        },
        {
            name : "Northeastern University",
            svcs : ["green"],
            bus : [39],
            lat : 42.340401,
            lon : -71.088806
        },
        {
            name : "Museum of Fine Arts",
            svcs : ["green"],
            bus : [8, 19, 39, 47, "CT2", "CT3"],
            lat : 42.337711,
            lon : -71.095512
        },
        {
            name : "Longwood Medical",
            svcs : ["green"],
            bus : [39, "CT2"],
            lat : 42.33596,
            lon : -71.100052
        },
        {
            name : "Brigham Circle",
            svcs : ["green"],
            bus : [39, 66],
            lat : 42.334229,
            lon : -71.104609
        },
        {
            name : "Fenwood Rd",
            svcs : ["green"],
            bus : [39, 66],
            lat : 42.333706,
            lon : -71.105728
        },
        {
            name : "Mission Park",
            svcs : ["green"],
            bus : [39, 66],
            lat : 42.333195,
            lon : -71.109756
        },
        {
            name : "Riverway",
            svcs : ["green"],
            bus : [39, 66],
            lat : 42.331684,
            lon : -71.111931
        },
        {
            name : "Back of the Hill",
            svcs : ["green"],
            bus : [39],
            lat : 42.330139,
            lon : -71.111313
        },
        {
            name : "Heath Street",
            svcs : ["green"],
            bus : [14, 39],
            lat : 42.328681,
            lon : -71.110559
        },
        
        // Avoiding repeats, now do the Orange Line
        {
            name : "Oak Grove",
            svcs : ["orange"],
            bus : [131, 132, 136, 137],
            lat : 42.43668,
            lon : -71.071097,
            orangeMap : {
              up : 49,
              dn : 32,
              sta: 34
            }
        },
        {
            name : "Malden Center",
            svcs : ["orange", "haverhill"],
            bus : [97, 99, 101, 104, 105, 106, 108, 131, 132, 136, 137, 411, 430],
            lat : 42.426632,
            lon : -71.07411,
            orangeMap : {
              up : 72,
              dn : 49,
              sta: 58
            }
        },
        {
            name : "Wellington",
            svcs : ["orange"],
            bus : [90, 97, 99, 100, 106, 108, 110, 112, 134],
            lat : 42.40237,
            lon : -71.077082,
            orangeMap : {
              up : 98,
              dn : 72,
              sta: 84
            }
        },
        {
            name : "Sullivan",
            svcs : ["orange"],
            bus : [86, 89, 90, 91, 92, 93, 95, 101, 104, 105, 109, "CT2"],
            lat : 42.383975,
            lon : -71.076994,
            orangeMap : {
              up : 122,
              dn : 98,
              sta: 109
            }
        },
        {
            name : "Community College",
            svcs : ["orange"],
            bus : [],
            lat : 42.373622,
            lon : -71.069533,
            orangeMap : {
              up : 145,
              dn : 122,
              sta: 134
            }
        },
        {
            name : "State Street",
            svcs : ["orange", "blue"],
            bus : [92, 93, 352, 354],
            lat : 42.358978,
            lon : -71.057598,
            orangeMap : {
              up : 223,
              dn : 198,
              sta: 206
            }
        },
        {
            name : "Downtown Crossing",
            svcs : ["orange", "red"],
            bus : [7, 11, 92, 93, 448, 449, 459, 501, 504, 505, 553, 554, 556, 558, "SL5"],
            lat : 42.355518,
            lon : -71.060225,
            orangeMap : {
              up : 247,
              dn : 223,
              sta: 235
            }
        },
        {
            name : "Chinatown",
            svcs : ["orange"],
            bus : [11, "SL4", "SL5"],
            lat : 42.352547,
            lon : -71.062752,
            orangeMap : {
              up : 273,
              dn : 247,
              sta: 258
            }
        },
        {
            name : "Tufts Medical",
            svcs : ["orange"],
            bus : [11, 43, "SL4", "SL5"],
            lat : 42.349662,
            lon : -71.063917,
            orangeMap : {
              up : 298,
              dn : 273,
              sta: 284
            }
        },
        {
            name : "Back Bay",
            svcs : ["orange", "prov_stough", "worcester", "needham", "franklin"],
            bus : [10, 39, 170],
            lat : 42.34735,
            lon : -71.075727,
            orangeMap : {
              up : 322,
              dn : 238,
              sta: 307
            }
        },
        {
            name : "Mass Ave",
            svcs : ["orange"],
            bus : [1, "CT1"],
            lat : 42.341512,
            lon : -71.083423,
            orangeMap : {
              up : 348,
              dn : 322,
              sta: 333
            }
        },
        {
            name : "Ruggles",
            svcs : ["orange", "prov_stough", "needham", "franklin"],
            bus : [8, 15, 19, 22, 23, 25, 28, 42, 43, 44, 45, 47, "CT2", "CT3"],
            lat : 42.336377,
            lon : -71.088961,
            orangeMap : {
              up : 372,
              dn : 348,
              sta: 359
            }
        },
        {
            name : "Roxbury Crossing",
            svcs : ["orange"],
            bus : [15, 19, 22, 23, 25, 28, 42, 44, 45, 66],
            lat : 42.331397,
            lon : -71.095451,
            orangeMap : {
              up : 398,
              dn : 372,
              sta: 384
            }
        },
        {
            name : "Jackson Square",
            svcs : ["orange"],
            bus : [14, 22, 29, 41, 44],
            lat : 42.323132,
            lon : -71.099592,
            orangeMap : {
              up : 422,
              dn : 398,
              sta: 408
            }
        },
        {
            name : "Stony Brook",
            svcs : ["orange"],
            bus : [48],
            lat : 42.317062,
            lon : -71.104248,
            orangeMap : {
              up : 448,
              dn : 422,
              sta: 435
            }
        },
        {
            name : "Green Street",
            svcs : ["orange"],
            bus : [48],
            lat : 42.310525,
            lon : -71.107414,
            orangeMap : {
              up : 470,
              dn : 448,
              sta: 458
            }
        },
        {
            name : "Forest Hills",
            svcs : ["orange", "needham"],
            bus : [16, 21, 30, 31, 32, 34, "34E", 35, 36, 37, 38, 39, 40, 42, 50, 51],
            lat : 42.300523,
            lon : -71.113686,
            orangeMap : {
              up : 487,
              dn : 470,
              sta: 484
            }
        },
        
        // Now the Blue Line (again avoiding repeats)
        {
            name : "Wonderland",
            svcs : ["blue"],
            bus : [110, 114, 116, 117, 411, 441, 448, 442, 449, 424, 450, 455],
            lat : 42.41342,
            lon : -70.991648
        },
        {
            name : "Revere Beach",
            svcs : ["blue"],
            bus : [110, 117, 411],
            lat : 42.40784254,
            lon : -70.99253321
        },
        {
            name : "Beachmont",
            svcs : ["blue"],
            bus : [119],
            lat : 42.39754234,
            lon : -70.99231944
        },
        {
            name : "Suffolk Downs",
            svcs : ["blue"],
            bus : [],
            lat : 42.39050067,
            lon : -70.99712259
        },
        {
            name : "Orient Heights",
            svcs : ["blue"],
            bus : [120],
            lat : 42.386867,
            lon : -71.004736
        },
        {
            name : "Wood Island",
            svcs : ["blue"],
            bus : [112, 120, 121],
            lat : 42.3796403,
            lon : -71.02286539
        },
        {
            name : "Airport",
            svcs : ["blue"],
            bus : [],
            lat : 42.374262,
            lon : -71.030395
        },
        {
            name : "Maverick",
            svcs : ["blue"],
            bus : [114, 116, 117, 120, 121],
            lat : 42.36911856,
            lon : -71.03952958
        },
        {
            name : "Aquarium",
            svcs : ["blue"],
            bus : [6],
            lat : 42.359784,
            lon : -71.051652
        },
        {
            name : "Bowdoin",
            svcs : ["blue"],
            bus : [],
            lat : 42.361365,
            lon : -71.062037
        },
        
        // Now the Red Line (again without repeated stations)
        {
            name : "Alewife",
            svcs : ["red"],
            bus : [62, 76, 67, 79, 84, 350, 351],
            lat : 42.395428,
            lon : -71.142483
        },
        {
            name : "Davis",
            svcs : ["red"],
            bus : [87, 88, 89, 90, 94, 96],
            lat : 42.39674,
            lon : -71.121815
        },
        {
            name : "Porter Square",
            svcs : ["red", "fitchburg"],
            bus : [77, "77A", 83, 96],
            lat : 42.3884,
            lon : -71.119149
        },
        {
            name : "Harvard Square",
            svcs : ["red"],
            bus : [1, 66, 68, 69, 71, 72, 73, 74, 75, 77, 78, 86, 96],
            lat : 42.373362,
            lon : -71.118956
        },
        {
            name : "Central Square",
            svcs : ["red"],
            bus : [1, 47, 64, 70, "70A", 83, 91, "CT1"],
            lat : 42.365486,
            lon : -71.103802
        },
        {
            name : "Kendall/MIT",
            svcs : ["red"],
            bus : [64, 68, 85, "CT2"],
            lat : 42.36249079,
            lon : -71.08617653
        },
        {
            name : "South Station",
            svcs : ["red", "s_station"],
            bus : [7, 11, 448, 449, 459, "SL1", "SL2", "SL4"],
            lat : 42.352271,
            lon : -71.055242
        },
        {
            name : "Broadway",
            svcs : ["red"],
            bus : [9, 11, 47],
            lat : 42.342622,
            lon : -71.056967
        },
        {
            name : "Andrew",
            svcs : ["red"],
            bus : [5, 10, 16, 17, 18, 171, "CT3"],
            lat : 42.330154,
            lon : -71.057655
        },
        {
            name : "JFK/UMass",
            svcs : ["red", "king_plym", "greenbush", "middleborough"],
            bus : [5, 8, 16, 41],
            lat : 42.320685,
            lon : -71.052391
        },
        {
            name : "Savin Hill",
            svcs : ["red"],
            bus : [18],
            lat : 42.31129,
            lon : -71.053331
        },
        {
            name : "Fields Corner",
            svcs : ["red"],
            bus : [15, 17, 18, 19, 201, 202, 210],
            lat : 42.300093,
            lon : -71.061667
        },
        {
            name : "Shawmut",
            svcs : ["red"],
            bus : [],
            lat : 42.29312583,
            lon : -71.06573796
        },
        {
            name : "Ashmont",
            svcs : ["red"],
            bus : [18, 21, 22, 23, 24, 26, 27, 215, 217, 240],
            lat : 42.284652,
            lon : -71.064489
        },
        {
            name : "North Quincy",
            svcs : ["red"],
            bus : [210, 211, 212],
            lat : 42.275275,
            lon : -71.029583
        },
        {
            name : "Wollaston",
            svcs : ["red"],
            bus : [211, 217],
            lat : 42.2665139,
            lon : -71.0203369
        },
        {
            name : "Quincy Center",
            svcs : ["red", "king_plym", "greenbush", "middleborough"],
            bus : [210, 211, 212, 214, 215, 216, 217, 220, 221, 222, 225, 230, 236, 238, 245],
            lat : 42.251809,
            lon : -71.005409
        },
        {
            name : "Quincy Adams",
            svcs : ["red"],
            bus : [238],
            lat : 42.233391,
            lon : -71.007153
        },
        {
            name : "Braintree",
            svcs : ["red", "king_plym", "middleborough"],
            bus : [230, 236],
            lat : 42.2078543,
            lon : -71.0011385
        },

        // Remaining Commuter Rail Stops (That haven't been listed already as
        // a result of being connected to subway stations).

        // Fairmount C.R. Line
        {
            name : "Uphams Corner",
            svcs : ["fairmount"],
            bus : [15],
            lat : 42.318670,
            lon : -71.069072
        },
        {
            name : "Talbot Ave",
            svcs : ["fairmount"],
            bus : [],
            lat : 42.291925,
            lon : -71.078457
        },
        {
            name : "Morton St",
            svcs : ["fairmount"],
            bus : [21, 26],
            lat : 42.280777,
            lon : -71.085518
        },
        {
            name : "Fairmount",
            svcs : ["fairmount", "franklin"],    // Despite only ONE Franklin train stopping here
            bus : [24],                          // per day, according to the timetables
            lat : 42.253638,
            lon : -71.119270
        },
        {
            name : "Readville",
            svcs : ["fairmount", "franklin"],
            bus : [32, 33],
            lat : 42.237750,
            lon : -71.132376
        },

        // Franklin C.R. Line (without repeats)
        {
            name : "Hyde Park",
            svcs : ["franklin", "prov_stough"],
            bus : [32, 33, 50],
            lat : 42.2552,
            lon : -71.1252
        },
        {
            name : "Endicott",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.232881,
            lon : -71.160413
        },
        {
            name : "Dedham Corp Center",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.225896,
            lon : -71.173806
        },
        {
            name : "Islington",
            svcs : ["franklin", "fairmount"],
            bus : ["34E"],
            lat : 42.220714,
            lon : -71.183406
        },
        {
            name : "Norwood Depot",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.195668,
            lon : -71.196784
        },
        {
            name : "Norwood Central",
            svcs : ["franklin", "fairmount"],
            bus : ["34E"],
            lat : 42.190776,
            lon : -71.199748
        },
        {
            name : "Windsor Gardens",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.172192,
            lon : -71.220704
        },
        {
            name : "Plimptonville",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.159123,
            lon : -71.236125
        },
        {
            name : "Walpole",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.145477,
            lon : -71.257790
        },
        {
            name : "Norfolk",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.120694,
            lon : -71.325217
        },
        {
            name : "Franklin",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.083591,
            lon : -71.396735
        },
        {
            name : "Forge Park / 495",
            svcs : ["franklin", "fairmount"],
            bus : [],
            lat : 42.089941,
            lon : -71.439020
        },
        
        // Fitchburg Line
        {
            name : "Belmont",
            svcs : ["fitchburg"],
            bus : [72, 74, 75],
            lat : 42.395896,
            lon : -71.176190
        },
        {
            name : "Waverley",
            svcs : ["fitchburg"],
            bus : [73, 554],
            lat : 42.387489,
            lon : -71.189864
        },
        {
            name : "Waltham",
            svcs : ["fitchburg"],
            bus : [70, "70A", 170, 505, 553, 554, 556, 558],
            lat : 42.374424,
            lon : -71.236595
        },
        {
            name : "Brandeis/ Roberts",
            svcs : ["fitchburg"],
            bus : [553],
            lat : 42.361728,
            lon : -71.260854
        },
        {
            name : "Kendal Green",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.378970,
            lon : -71.282411
        },
        {
            name : "Hastings",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.385755,
            lon : -71.289203
        },
        {
            name : "Silver Hill",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.395625,
            lon : -71.302357
        },
        {
            name : "Lincoln",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.414229,
            lon : -71.325344
        },
        {
            name : "Concord",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.457147,
            lon : -71.358051
        },
        {
            name : "West Concord",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.456372,
            lon : -71.392371
        },
        {
            name : "South Acton",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.461575,
            lon : -71.455322
        },
        {
            name : "Littleton / Rte 495",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.519236,
            lon : -71.502643
        },
        {
            name : "Ayer",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.560047,
            lon : -71.590117
        },
        {
            name : "Shirley",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.544726,
            lon : -71.648363
        },
        {
            name : "North Leominster",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.540577,
            lon : -71.739402
        },
        {
            name : "Fitchburg",
            svcs : ["fitchburg"],
            bus : [],
            lat : 42.581739,
            lon : -71.792750
        },
        
        // Framingham Worcester Line
        {
            name : "Yawkey",
            svcs : ["worcester"],
            bus : [],
            lat : 42.346796,
            lon : -71.098937
        },
        {
            name : "Newtonville",
            svcs : ["worcester"],
            bus : [59, 553, 554, 556],
            lat : 42.351603,
            lon : -71.207338
        },
        {
            name : "West Newton",
            svcs : ["worcester"],
            bus : [553, 554],
            lat : 42.348599,
            lon : -71.229010
        },
        {
            name : "Auburndale",
            svcs : ["worcester"],
            bus : [505, 558],
            lat : 42.346087,
            lon : -71.246658
        },
        {
            name : "Wellesley Farms",
            svcs : ["worcester"],
            bus : [],
            lat : 42.323608,
            lon : -71.272288
        },
        {
            name : "Wellesley Hills",
            svcs : ["worcester"],
            bus : [],
            lat : 42.310027,
            lon : -71.276769
        },
        {
            name : "Wellesley Square",
            svcs : ["worcester"],
            bus : [],
            lat : 42.296427,
            lon : -71.294311
        },
        {
            name : "Natick",
            svcs : ["worcester"],
            bus : [],
            lat : 42.285239,
            lon : -71.347641
        },
        {
            name : "West Natick",
            svcs : ["worcester"],
            bus : [],
            lat : 42.281855,
            lon : -71.390548
        },
        {
            name : "Framingham",
            svcs : ["worcester"],
            bus : [],
            lat : 42.276719,
            lon : -71.416792
        },
        {
            name : "Ashland",
            svcs : ["worcester"],
            bus : [],
            lat : 42.261694,
            lon : -71.478813
        },
        {
            name : "Southborough",
            svcs : ["worcester"],
            bus : [],
            lat : 42.267518,
            lon : -71.523621
        },
        {
            name : "Westborough",
            svcs : ["worcester"],
            bus : [],
            lat : 42.269184,
            lon : -71.652005
        },
        {
            name : "Grafton",
            svcs : ["worcester"],
            bus : [],
            lat : 42.246291,
            lon : -71.684614
        },
        {
            name : "Worcester / Union Station",
            svcs : ["worcester"],
            bus : [],
            lat : 42.261796,
            lon : -71.793881
        },
        
        // Greenbush Line
        {
            name : "Weymouth Landing/ East Braintree",
            svcs : ["greenbush"],
            bus : [225],
            lat : 42.220800,
            lon : -70.968200
        },
        {
            name : "East Weymouth",
            svcs : ["greenbush"],
            bus : [222],
            lat : 42.219100,
            lon : -70.921400
        },
        {
            name : "West Hingham",
            svcs : ["greenbush"],
            bus : [],
            lat : 42.236700,
            lon : -70.903100
        },
        {
            name : "Nantasket Junction",
            svcs : ["greenbush"],
            bus : [],
            lat : 42.245200,
            lon : -70.869800
        },
        {
            name : "Cohasset",
            svcs : ["greenbush"],
            bus : [],
            lat : 42.242400,
            lon : -70.837000
        },
        {
            name : "North Scituate",
            svcs : ["greenbush"],
            bus : [],
            lat : 42.219700,
            lon : -70.787700
        },
        {
            name : "Greenbush",
            svcs : ["greenbush"],
            bus : [],
            lat : 42.178100,
            lon : -70.746200
        },
        
        // Haverhill Line
        {
            name : "Wyoming Hill",
            svcs : ["haverhill"],
            bus : [131, 132, 136, 137],
            lat : 42.452097,
            lon : -71.069518
        },
        {
            name : "Melrose Cedar Park",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.459128,
            lon : -71.069448
        },
        {
            name : "Melrose Highlands",
            svcs : ["haverhill"],
            bus : [131],
            lat : 42.468793,
            lon : -71.068270
        },
        {
            name : "Greenwood",
            svcs : ["haverhill"],
            bus : [136, 137],
            lat : 42.483473,
            lon : -71.067233
        },
        {
            name : "Wakefield",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.501811,
            lon : -71.075000
        },
        {
            name : "Reading",
            svcs : ["haverhill"],
            bus : [136, 137],
            lat : 42.521480,
            lon : -71.107440
        },
        {
            name : "North Wilmington",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.568462,
            lon : -71.159724
        },
        {
            name : "Ballardvale",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.626449,
            lon : -71.159653
        },
        {
            name : "Andover",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.657798,
            lon : -71.144513
        },
        {
            name : "Lawrence",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.701806,
            lon : -71.151980
        },
        {
            name : "Bradford",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.768899,
            lon : -71.085998
        },
        {
            name : "Haverhill",
            svcs : ["haverhill"],
            bus : [],
            lat : 42.772684,
            lon : -71.085962
        },
        
        // Kingston/Plymouth Line
        {
            name : "South Weymouth",
            svcs : ["king_plym"],
            bus : [],
            lat : 42.153747,
            lon : -70.952490
        },
        {
            name : "Abington",
            svcs : ["king_plym"],
            bus : [],
            lat : 42.108034,
            lon : -70.935296
        },
        {
            name : "Whitman",
            svcs : ["king_plym"],
            bus : [],
            lat : 42.083563,
            lon : -70.923204
        },
        {
            name : "Hanson",
            svcs : ["king_plym"],
            bus : [],
            lat : 42.043262,
            lon : -70.881553
        },
        {
            name : "Halifax",
            svcs : ["king_plym"],
            bus : [],
            lat : 42.012867,
            lon : -70.820832
        },
        {
            name : "Kingston",
            svcs : ["king_plym"],
            bus : [],
            lat : 41.978548,
            lon : -70.720315
        },
        {
            name : "Plymouth",
            svcs : ["king_plym"],
            bus : [],
            lat : 41.981184,
            lon : -70.692514
        },
                
        // Lowell Line
        {
            name : "West Medford",
            svcs : ["lowell", "haverhill"],
            bus : [],
            lat : 42.421184,
            lon : -71.132468
        },
        {
            name : "Wedgemere",
            svcs : ["lowell", "haverhill"],
            bus : [94, 95, 326],
            lat : 42.445284,
            lon : -71.140909
        },
        {
            name : "Winchester Center",
            svcs : ["lowell", "haverhill"],
            bus : [134],
            lat : 42.452650,
            lon : -71.137041
        },
        {
            name : "Mishawum",
            svcs : ["lowell"],
            bus : [],
            lat : 42.503595,
            lon : -71.137511
        },
        {
            name : "Anderson/ Woburn",
            svcs : ["lowell", "haverhill"],
            bus : [],
            lat : 42.518082,
            lon : -71.138650
        },
        {
            name : "Wilmington",
            svcs : ["lowell", "haverhill"],
            bus : [],
            lat : 42.546368,
            lon : -71.173569
        },
        {
            name : "North Billerica",
            svcs : ["lowell"],
            bus : [],
            lat : 42.592881,
            lon : -71.280869
        },
        {
            name : "Lowell",
            svcs : ["lowell"],
            bus : [],
            lat : 42.638402,
            lon : -71.314916
        },
                
        // Middleborough / Lakeville Line
        {
            name : "Holbrook/ Randolph",
            svcs : ["middleborough"],
            bus : [238, 240],
            lat : 42.155314,
            lon : -71.027518
        },
        {
            name : "Montello",
            svcs : ["middleborough"],
            bus : [230],
            lat : 42.106047,
            lon : -71.021078
        },
        {
            name : "Brockton",
            svcs : ["middleborough"],
            bus : [],
            lat : 42.085720,
            lon : -71.016860
        },
        {
            name : "Campello",
            svcs : ["middleborough"],
            bus : [],
            lat : 42.060038,
            lon : -71.012460
        },
        {
            name : "Bridgewater",
            svcs : ["middleborough"],
            bus : [],
            lat : 41.986355,
            lon : -70.966625
        },
        {
            name : "Middleborough/ Lakeville",
            svcs : ["middleborough"],
            bus : [],
            lat : 41.878210,
            lon : -70.918444
        },
        
        // Needham Line
        {
            name : "Roslindale Village",
            svcs : ["needham"],
            bus : [14, 30, 35, 36, 37, 51],
            lat : 42.287206,
            lon : -71.129610
        },
        {
            name : "Bellevue",
            svcs : ["needham"],
            bus : [35, 36, 37, 38],
            lat : 42.287138,
            lon : -71.146060
        },
        {
            name : "Highland",
            svcs : ["needham"],
            bus : [35, 36, 37, 38],
            lat : 42.284869,
            lon : -71.154700
        },
        {
            name : "West Roxbury",
            svcs : ["needham"],
            bus : [35, 36, 37],
            lat : 42.281600,
            lon : -71.159932
        },
        {
            name : "Hersey",
            svcs : ["needham"],
            bus : [],
            lat : 42.275842,
            lon : -71.214853
        },
        {
            name : "Needham Junction",
            svcs : ["needham"],
            bus : [59],
            lat : 42.273327,
            lon : -71.238007
        },
        {
            name : "Needham Center",
            svcs : ["needham"],
            bus : [59],
            lat : 42.280274,
            lon : -71.238089
        },
        {
            name : "Needham Heights",
            svcs : ["needham"],
            bus : [59],
            lat : 42.293139,
            lon : -71.235087
        },
        
        
        // Newburyport / Rockport Line
        {
            name : "Chelsea",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.395661,
            lon : -71.034826
        },
        {
            name : "River Works",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.453804,
            lon : -70.975698
        },
        {
            name : "Lynn",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.462293,
            lon : -70.947794
        },
        {
            name : "Swampscott",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.473739,
            lon : -70.922036
        },
        {
            name : "Salem",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.523927,
            lon : -70.898903
        },
        {
            name : "Beverly",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.546907,
            lon : -70.885168
        },
        {
            name : "Montserrat",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.561483,
            lon : -70.870035
        },
        {
            name : "Prides Crossing",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.559513,
            lon : -70.824813
        },
        {
            name : "Beverly Farms",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.561403,
            lon : -70.812745
        },
        {
            name : "Manchester",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.573570,
            lon : -70.770473
        },
        {
            name : "West Gloucester",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.610928,
            lon : -70.706456
        },
        {
            name : "Gloucester",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.616069,
            lon : -70.668767
        },
        {
            name : "Rockport",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.656173,
            lon : -70.625616
        },
        {
            name : "North Beverly",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.582471,
            lon : -70.884501
        },
        {
            name : "Hamilton/ Wenham",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.610756,
            lon : -70.874005
        },
        {
            name : "Ipswich",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.678355,
            lon : -70.840024
        },
        {
            name : "Rowley",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.725351,
            lon : -70.859436
        },
        {
            name : "Newburyport",
            svcs : ["newb_rock"],
            bus : [],
            lat : 42.800292,
            lon : -70.880262
        },
        
        
        // Providence / Stoughton Line
        {
            name : "Route 128",
            svcs : ["prov_stough"],
            bus : [],
            lat : 42.209884,
            lon : -71.147100
        },
        {
            name : "Canton Junction",
            svcs : ["prov_stough"],
            bus : [],
            lat : 42.163423,
            lon : -71.153374
        },
        {
            name : "Canton Center",
            svcs : ["prov_stough"],
            bus : [],
            lat : 42.156769,
            lon : -71.145530
        },
        {
            name : "Stoughton",
            svcs : ["prov_stough"],
            bus : [],
            lat : 42.123818,
            lon : -71.103090
        },
        {
            name : "Sharon",
            svcs : ["prov_stough"],
            bus : [],
            lat : 42.124804,
            lon : -71.183213
        },
        {
            name : "Mansfield",
            svcs : ["prov_stough"],
            bus : [],
            lat : 42.032734,
            lon : -71.219318
        },
        {
            name : "Attleboro",
            svcs : ["prov_stough"],
            bus : [],
            lat : 41.942097,
            lon : -71.284897
        },
        {
            name : "South Attleboro",
            svcs : ["prov_stough"],
            bus : [],
            lat : 41.897943,
            lon : -71.354621
        },
        {
            name : "Providence",
            svcs : ["prov_stough"],
            bus : [],
            lat : 41.829641,
            lon : -71.413332
        },
        {
            name : "TF Green Airport",
            svcs : ["prov_stough"],
            bus : [],
            lat : 41.726599,
            lon : -71.442453
        },
        {
            name : "Wickford Junction",
            svcs : ["prov_stough"],
            bus : [],
            lat : 41.580800,
            lon : -71.491400
        }
        
        // END OF ALL COMMUTER RAIL STOPS NOT COVERED BY SUBWAY STATIONS
    ];
