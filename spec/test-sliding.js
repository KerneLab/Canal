var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test sliding", function()
{
	it("sliding(2) 3", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3 ]).sliding(2).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2], [3] ]);
	});
	
	it("sliding(2,1) 3", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3 ]).sliding(2,1).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2], [2,3] ]);
	});

	it("sliding(3,2) 3", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3 ]).sliding(3,2).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2,3] ]);
	});
	
	it("sliding(3,2) 4", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3, 4 ]).sliding(3,2).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2,3], [3,4] ]);
	});

	it("sliding(3,2) 5", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3, 4, 5 ]).sliding(3,2).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2,3], [3,4,5] ]);
	});
	
	it("sliding(2,3) 5", function()
	{
		var result = [];
		Canal.of([ 1, 2, 3, 4, 5 ]).sliding(2,3).foreach(function(c){
			result.push(c.collect());
		});
		expect(result).to.eql([ [1,2], [4,5] ]);
	});
	
	it("sliding() 2", function()
	{
		var result = Canal.of([ 1, 2 ]).sliding().count();
		expect(result).to.eql(0);
	});

	it("sliding() empty", function()
	{
		var result = Canal.of([]).sliding().count();
		expect(result).to.eql(0);
	});
});
