
// Create a shred
require( ["models/shred"],
    function(Shred) {

	var shred = new Shred({
		'title' : 'Super Swag Test Shred',
		'tabs' :[
			{},
			{}
		],
		'owner' : {
			'id': "521fc6d98ca794059600004a",
			'username': "Michael Kølleskov Gunnulfsen"
		},
	});
	shred.save();
});
