# 5p.gg

## LoL Counter Pick Assitant Discord Bot
Due to the lack of an [OP.GG](op.gg) API, this bot uses the `request-promise` library to fetch html from op.gg's champion matchup pages which is then parsed using `cheerio`.

5p.gg will log the winrates (with sample sizes) against the enemy pick for all champions in your pool in descending order. If there is no data on the matchup the values will log as ```null```.
## Current Features

### Commands 

```>start``` Initialize a 5p.gg profile to hold pool and matchup data.


```>add <champ>``` Adds the provided champion to the users pool.


```>delete <champ>``` Removes the provided champion from the users pool.


```>pool``` Tells the user which champs are currently in their pool.


```>counter <matchup> <lane>``` Will display champion pool winrates versus given matchup in specified lane.


```>op <lane>``` Finds and logs all op.gg tier 1 champions for the supplied lane.

### Example Usage
#### Basic use of pool functionality
![Basic use of 5p.gg](https://i.gyazo.com/2544ba1f83e66e656df102826d9b2444.png)


#### >op <role> command
![op command results](https://i.gyazo.com/188f6827f8331eab4e2d233ea0c3d849.png)


## Improvment
This project is essentially a proof of concept for the moment. My goals with it are to:
* Migrate 5p.gg to a full stack web application
* Data caching
* Develop a smarter algorithm accounting for champion proficency
* Matchup specific rune recommendations
* Matchup specific CS Goal
* Ban recommendations based on champ pool
