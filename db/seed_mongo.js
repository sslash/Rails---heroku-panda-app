// Create badges
youngTut = {
	title : 'The Young Tutorer',
	description : 'Obtained the first time a Shredder adds tabs to a Shred',
	img : 'theYoungTutorer.png',
	xpGained : 380
}

db.badges.save(youngTut);

// Create guitars
db.guitars.save({
	title : 'Fender Stratocaster'
});

db.guitars.save({
	title : 'Gibson Les Paul'
});

db.guitars.save({
	title : 'Music Man Luke'
});