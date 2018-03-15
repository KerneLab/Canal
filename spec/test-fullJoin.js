var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test fullJoin", function()
{
	var mapper = function(l, r)
	{
		return [ l.or("_"), r.or("_") ];
	};

	it("fullJoin()", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ] ]).fullJoin(Canal.of([ [ "b", 1 ], [ "c", 2 ] ]))
				.mapJoint(mapper).collect();
		expect(result).to.eql([ [ 1, "_" ], [ 2, 1 ], [ 3, 1 ], [ "_", 2 ] ]);
	});

	it("fullJoin() partially", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ] ]).fullJoin(Canal.of([ [ "b", 1 ], [ "c", 2 ] ]))
				.mapJoint(mapper).take(2);
		expect(result).to.eql([ [ 1, "_" ], [ 2, 1 ] ]);
	});

	it("fullJoin() 1 vs empty", function()
	{
		var result = Canal.of([ [ "a", 1 ] ]).fullJoin(Canal.of([])) //
		.mapJoint(mapper).collect();
		expect(result).to.eql([ [ 1, "_" ] ]);
	});

	it("fullJoin() 4 vs 1 partially", function()
	{
		var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ]) //
		.fullJoin(Canal.of([ [ "d", "4th" ] ])) //
		.mapJoint(mapper).take(2);
		expect(result).to.eql([ [ 1, "_" ], [ 2, "_" ] ]);
	});

	it("fullJoin() empty vs 1", function()
	{
		var result = Canal.of([]).fullJoin(Canal.of([ [ "b", 1 ] ])) //
		.mapJoint(mapper).collect();
		expect(result).to.eql([ [ "_", 1 ] ]);
	});

	it("fullJoin() 1 vs 4 partially", function()
	{
		var result = Canal.of([ [ "d", "4th" ] ]) //
		.fullJoin(Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "c", 3 ], [ "d", 4 ] ])) //
		.mapJoint(mapper).take(2);
		expect(result).to.eql([ [ "4th", 4 ], [ "_", 1 ] ]);
	});

	it("fullJoin() empty vs empty", function()
	{
		var result = Canal.of([]).fullJoin(Canal.of([])) //
		.mapJoint(mapper).collect();
		expect(result).to.eql([]);
	});
});
