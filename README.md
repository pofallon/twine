# twine
A command line Twitter client

[![Build Status](https://travis-ci.org/pofallon/twine.svg?branch=master)](https://travis-ci.org/pofallon/twine) 
[![npm version](https://badge.fury.io/js/%40pofallon%2Ftwine.svg)](https://badge.fury.io/js/%40pofallon%2Ftwine)

This is a companion project to the Pluralsight course "Building Command Line Applications in Node.js"

There are branches to represent the state of the project at various points along the course:
* **module-2-start** The end of module 1 / start of module 2
* **module-3-start** The end of module 2 / start of module 3
* **module-4-start** The end of module 3 / start of module 4
* **module-5-start** The end of module 4 / start of module 5
* **module-5-complete** The end of module 5 (and the course)

You can install the latest version by running `npm install @pofallon/twine`.  Note that over time this version may contain features not covered in the Pluralsight course.

To use the `twine` CLI:
1. Login and create an application on apps.twitter.com
2. Run `twine configure consumer` and enter your application's consumer key and secret
3. Run `twine configure account` and follow the instructions
4. Run `twine lookup [screen_name]` to try looking up a Twitter user

Have an idea for some additional commands?  PRs are welcome!