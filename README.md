# Project: Housing Map
### Group: 40 

Project Description: A website with an integrated map allowing comparisons between neighborhoods (such as counties, congressional districts, etc.) showing home affordability based on utility prices and other comparisons

Problem: It is difficult to find affordable housing.

Solution: A website allowing comparisons between neighborhoods (such as counties, congressional districts, etc.) showing home affordability based on utility prices and other comparisons.

Key Features: Integrated map, Home page, About page, contact page, A list of favorite locations, a page to compare favorite locations. Displayuing various statisitics using external APIs.

Why This Project? Finding somewhere to move is always about more than just the house price, as there are other factors that will contribute to one’s quality of life. That information should be easily accessible.

## Environment Variable Setup (Backend)

### Census.gov API Key

You can request a Census.gov API key [here.](https://api.census.gov/data/key_signup.html)

```
CENSUS_API_KEY=SAMPLE_KEY
```

### Server Configuration

```
NODE_ENV=development
PORT=3000
```

## Team Member List
  - Kauan Ferreira - Role: Project Manager
    - Issue 1 : HTTP for Map Page
    - Issue 2 : Server Setup
    - Issue 3 : File Reformatting
    - Issue 4 : Backend Logic
      - Finding & Implementing API Census API calls
      - Routing logic for the frontend
      - Persistent town data stored to prevent overusage of API requests
  - Daniel Kennedy - Role: Assigment Aggregator
    - Issue 1 : HTTP for Favorite List
    - Issue 2 : HTTP for Comparison Page
    - Issue 3 : New functionality for Favorite List - Remove Favorite Button
  - John Hankwitz- Role: Quality Assurance
    - Issue 1 :
    - Issue 2 : 
    - Issue 3 : 

## Sources
U.S. Census Bureau, American Community Survey (ACS) 5-Year Estimates, 2021, https://api.census.gov/data/2021/acs/acs5