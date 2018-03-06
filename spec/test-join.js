var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test join", function(){

it("join()", function()
{
	var result = Canal.of([ [ "a", 1 ], [ "b", 2 ], [ "b", 3 ], [ "c", 4 ] ]).join(
			Canal.of([ [ "b", 1 ], [ "c", 2 ], [ "d", 3 ] ])).collect();
	expect(result).to.eql([ [ "b", [ 2, 1 ] ], [ "b", [ 3, 1 ] ], [ "c", [ 4, 2 ] ] ]);
});

it("join() kop, vop", function()
{
	var result = Canal.of([ 1, 2, 3 ]) //
	.join(Canal.of([ {
		id : 1,
		name : "Mike"
	}, {
		id : 2,
		name : "John"
	}, {
		id : 3,
		name : "Rose"
	}, {
		id : 4,
		name : "Bob"
	} ]), Canal.unit, function(d)
	{
		return d.id;
	}, Canal.unit, Canal.unit).collect();

	expect(result).to.eql([ [ "1", [ 1, {
		id : 1,
		name : "Mike"
	} ] ], [ "2", [ 2, {
		id : 2,
		name : "John"
	} ] ], [ "3", [ 3, {
		id : 3,
		name : "Rose"
	} ] ] ]);
});

it("join() 1 vs empty", function()
{
	var result = Canal.of([ [ "a", 1 ] ]).join(Canal.of([])).collect();
	expect(result).to.eql([]);
});

it("join() empty vs 1", function()
{
	var result = Canal.of([]).join(Canal.of([ [ "b", 1 ] ])).collect();
	expect(result).to.eql([]);
});

it("join() empty vs empty", function()
{
	var result = Canal.of([]).join(Canal.of([])).collect();
	expect(result).to.eql([]);
});

});
