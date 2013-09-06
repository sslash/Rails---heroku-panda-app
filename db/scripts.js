// Delete all since date
var end = new Date(2013, 7, 22);
db.shreds.remove({'timeCreated':{$gte: end}});
db.shreds.find({'timeCreated':{$gte: end}}).count();


// Find face michael
db.shredders.find({'username' : {$regex : 'Michael.*'}}).pretty();
db.fb_users.find().pretty();

// Delete face michael 
db.shredders.remove({'username' : 'Michael Kølleskov Gunnulfsen'});
db.fb_users.remove();