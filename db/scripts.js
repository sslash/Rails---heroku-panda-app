// Delete all since date
var end = new Date(2013, 7, 22);
db.shreds.remove({'timeCreated':{$gte: end}});
db.shreds.find({'timeCreated':{$gte: end}}).count();