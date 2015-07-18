#!/bin/bash
node ./server/server.js &
sleep 1
node ./tweetHandler/server.js &
