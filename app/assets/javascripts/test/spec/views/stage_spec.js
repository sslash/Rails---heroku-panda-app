define(['views/stage/stageView'], function(StageView) {
	describe('The Stage View', function () {

		describe('Banner Section', function () {

			beforeEach(function(){
				window.Shredr = new Backbone.Marionette.Application();
				view = new StageView();
				view.render();
			});

			afterEach(function() {
				view.close();
			});

			it('Render shredder view when shredder is clicked', function () {
				spyOn(view, '__shredderViewBtnClicked');
				view.delegateEvents();
				view.$('#shredder-view-btn').trigger('click');
				expect(view.__shredderViewBtnClicked).toHaveBeenCalled();

				
			});
		});
	});
});
