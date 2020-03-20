# Project Title - Find the Best Surf Spot Webpage

# Project Description 
To create an html/javascript webpage to find the best surf spots in Perth, given the date, weather conditions and ability at the current time or in the near future. 

# User outcome
As a user I want to find the best surf spot in Perth for today, tomorrow or the day after, depending on the weather and my level of ability (beginner,medium,advanced). 

# User Story 

WHEN I first arrive at the webpage, I select my level of ability.
THEN I also can select my postcode, or select sites near my current location.
THEN I choose when I want to surf: now, later today or tomorrow.
THEN I am shown a list of suitable surf spots (by name or picture), in an ordered list based on their proximity to me.
WHEN I click on a surf spot in the list, I am presented with the following information about that spot:

- Location & map of the surfspot 
- Coastal weather warnings (if any)
- Swell size
- Swell direction 
- Wind direction and strength 
- Weather conditions (temperature, UV etc)
- Tide times
- Sunrise/sunset times

# Wireframe layout 

To be submitted separately

# APIs used 
- Bureau of meterology, (more than one will be required: specifically, weather warnings, weather conditions, tidal conditions)
- Willyweather API (for information that cannot be retrieved from the BOM free of charge)
- Google Maps 
- Magic Seeweed (requested API access, but no response yet)

# Rough Breakdown of Tasks 

1. HTML & Stylesheet (Caroline)

# layout 

- LHS column with all inputs 
- RHS top, list with pictures in order of promixity, 
- RHS bottom, details about the chosen surfspot. 

# styling 
- sandy-yellow, blue & white (clean and simple but fun)
- responsive (suitable for use on a phone and PC)
- based on Foundation framework

2. JQuery (Jo and Miles)
- on click events to store user responses
- conditonal statements 
- select locations based on date (i.e. season), conditions and user inputs
- call relevant APIs and extract data
- render data to the screen

3. API understanding (Jo)
- Find relevant APIs
- Request/obtain access if required
- Determine requirements for extracting required data
- Identify which BOM weather stations most closely match every possible surf spot on our list.

4. Selection criteria (Miles)
- Determine decision algorithm for selecting surf spots based on available inputs
- Determine a date to move from summer/winter options

# Other information
## Places 
### Winter 
- Rottnest ( stricklands bay, rotto box)
- Leighton Beach
- Scarborough 
- Trigg 
- Cottesloe main 

### Summer 
- Scarborough
- Trigg 
- Secret south 
- Lancelin 
- Alcomos 
- Durrs 
- Yanchep 










