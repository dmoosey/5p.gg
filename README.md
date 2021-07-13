# 5p.gg
# Project is deprecated, working on a new version with the updated discord API.

## LoL Statistics Discord Bot
Due to the lack of an [OP.GG](op.gg) API, this bot uses the [`request-promise`](https://www.npmjs.com/package/request-promise) library to fetch html from op.gg which is then parsed and dissected using [`cheerio`](https://www.npmjs.com/package/cheerio).

Users can firect the bot to fetch different pieces of data according the series of programmed commands.
## Current Features

### Commands 

```>start``` Initialize a 5p.gg profile to hold pool and matchup data.


```>add <champ>``` Adds the provided champion to the users pool.


```>delete <champ>``` Removes the provided champion from the users pool.


```>pool``` Shows the user their current champ pool.


```>counter <matchup> <lane>``` Will display champion pool winrates versus given matchup in specified lane.


```>op <lane>``` Finds and logs all op.gg tier 1 champions for the supplied lane.

```>runes <champ> <lane>``` Provides the user a link to the given champions rune page for the specified lane.
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
* Role sub-pools
