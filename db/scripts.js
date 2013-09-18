// Delete all since date
var end = new Date();
db.shreds.remove({'timeCreated':{$gte: end}});
db.shreds.find({'timeCreated':{$gte: end}}).count();
db.shredders.update({"_id" : ObjectId("52291bde8ca79420ea000030")}, $pull {updates.fanees.added: {$lt: end}});


// Find face michael
db.shredders.find({'username' : {$regex : 'Michael.*'}}).pretty();
db.fb_users.find().pretty();

// Delete face michael 
db.shredders.remove({'username' : 'Michael Kølleskov Gunnulfsen'});
db.fb_users.remove();

// Fetch last shred
db.shreds.find().sort({'timeCreated' : -1}).limit(1).pretty();

// Reset badges for a user
db.shredders.update({'_id' : ObjectId("522b26358ca794069a00027d")}, {$set: {'badges' : {}}});

db.shredders.find().sort({'timeCreated' : -1}).limit(1).pretty();

// Add a new field to all collections
db.shredders.update({},{$set : {"fans":new Array()}},false,true); 
db.shredders.update({},{$set : {"last_logged_in": null}},false,true); 

// Remove a field
db.shredders.update({},{$unset : {"updates":""}},false,true); 

// Create a new badge
db.badges.save({
	"title" : "First 10 Fans",
	"description" : "Obtained when the Shredder gets his first 10 fans",
	"img" : "first10fanse.png",
	"xpGained" : 200
});

// Remove a badge:
var michael = db.shredders.findOne({'username' : {$regex : 'Michael.*'}});
michael.badges = {};
db.shredders.save(michael);


// Add 10 first10fanse
var shredders = db.shredders.find().limit(10);
var shredder = db.shredders.findOne({'username' : {$regex : 'Michael.*'}});
for ( var i = 0; i < 10; i++ ) {
	var s = {
		"_id" : shredders[i]._id,
		"username" : shredders[i].username,
		"profileImagePath" : shredders[i].onlineProfileImagePath,
		"added" : new Date()
	}

	shredder.fans.push(s);
	db.shredders.save(shredder);
}

