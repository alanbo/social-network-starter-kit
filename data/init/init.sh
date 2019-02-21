#!/bin/bash
# mongoimport --host mongo --port 27017 --db social --authenticationDatabase admin --collection users --type json --file /mock/users-social.json --jsonArray;
# mongoimport --host mongo --port 27017 --db social --authenticationDatabase admin --collection groups --type json --file /mock/groups-social.json --jsonArray;
# mongoimport --host mongo --port 27017 --db social --authenticationDatabase admin --collection posts --type json --file /mock/posts-social.json --jsonArray;


mongoimport --username root --password example --host mongo --port 27017 --db social --authenticationDatabase admin --collection users --type json --file /mock/users-social.json --jsonArray;
mongoimport --username root --password example --host mongo --port 27017 --db social --authenticationDatabase admin --collection groups --type json --file /mock/groups-social.json --jsonArray;
mongoimport --username root --password example --host mongo --port 27017 --db social --authenticationDatabase admin --collection posts --type json --file /mock/posts-social.json --jsonArray;


