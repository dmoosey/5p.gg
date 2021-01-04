# 5p.gg

## Node.JS CLI LoL Counter Pick Assitant
Due to the lack of an [OP.GG](op.gg) API, this script uses the `request-promise` library to fetch html from op.gg's champion matchup pages which is then parsed using `cheerio`.

5p.gg will log the winrates (with sample sizes) against the enemy pick for all champions in your pool in descending order. If there is no data on the matchup the values will log as ```null```.
## Current Features

### Commands
When 5p.gg asks ```What would you like to do? ```
* ```add```
* ```delete```
* ```pool```
* ```stats``` 

```add``` let's you add champions (one-by-one) to your pool of favourites.


```delete``` allows you to remove a champion from your pool.


```pool``` displays all champions currently saved in your pool.


```stats``` will prompt you for your role and matchup and then log the winrates of your favourite champs in that matchup.


```Ctrl+C``` at any point to quit
## Installation

### Requires
An internet connection
Install [Node.JS](https://nodejs.org/en/)

### Setup
Open Terminal and locate to the desired download directory

```git clone https://github.com/dmoosey/5p.gg``` to a directory on your machine


```cd 5p.gg``` to enter the 5p.gg directory


```npm i```  to install dependencies


```node index.js``` to run 


Add your champs one at a time using the ```add``` command.


Once in game ask 5p.gg for ```stats``` and follow the prompts.

## Improvment
This project is essentially a proof of concept for the moment. My goals with it are to:
* Migrate 5p.gg to a full stack web application
* Add user profiles and data caching
* Develop a smarter algorithm accounting for champion proficency
* Matchup specific rune recommendations
* Matchup specific CS Goal
* Ban recommendations for champ pool
