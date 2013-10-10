define(['models/shred'], function(Shred) {
	describe('Model::Shred', function () {

		describe('shred', function () {
			it('should have default values', function () {
				var t = new Shred();
				expect(t.get("title")).toEqual("");
			});
		});
	});
});
