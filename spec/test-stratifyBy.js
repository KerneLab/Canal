var Canal = require('../canal');

describe("Test stratifyBy", function(){

it("stratifyBy()", function()
{
	var result = Canal.of([ {
		"id" : 4
	}, {
		"id" : 3
	}, {
		"id" : 1
	}, {
		"id" : 3
	} ]).stratifyBy(function(d)
	{
		return d.id;
	}, true).collect();

	expect(result).toEqual(
	[
	    [ {
			"id" : 1
		} ],
		[ {
			"id" : 3
		}, {
			"id" : 3
		} ],
		[ {
			"id" : 4
		} ]
    ]);
});

it("stratifyBy([])", function()
{
	var result = Canal.of([ {
		"id" : 4
	}, {
		"id" : 3
	}, {
		"id" : 1
	}, {
		"id" : 3
	} ]).stratifyBy([function(d)
	{
		return d.id;
	}, false]).collect();

	expect(result).toEqual(
	[
		[ {
			"id" : 4
		} ],
		[ {
			"id" : 3
		}, {
			"id" : 3
		} ],
	    [ {
			"id" : 1
		} ]
    ]);
});

});
