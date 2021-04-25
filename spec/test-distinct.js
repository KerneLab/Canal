var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test distinct", function(){

it("distinct() 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().collect();
	expect(result).to.eql([ 1, 2, 3 ]);
});

it("distinct().take(2) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().take(2);
	expect(result).to.eql([ 1, 2 ]);
});

it("distinct(cmp) obj", function()
{
	var result = Canal.of([ 
		{"id":1, "name":"a"},
		{"id":1, "name":"b"},
		{"id":2, "name":"c"}
	]).distinct(Canal.cmp("id")).collect();
	expect(result).to.eql([ {"id":1, "name":"a"}, {"id":2, "name":"c"} ]);
});

it("distinct().take(0) 1 2 3", function()
{
	var result = Canal.of([ 1, 2, 3 ]).distinct().take(0);
	expect(result).to.eql([]);
});

it("distinct() 1 2 2", function()
{
	var result = Canal.of([ 1, 2, 2 ]).distinct().collect();
	expect(result).to.eql([ 1, 2 ]);
});

it("distinct().take(1) 1 2 2", function()
{
	var result = Canal.of([ 1, 2, 2 ]).distinct().take(1);
	expect(result).to.eql([ 1 ]);
});

it("distinct() 1 1", function()
{
	var result = Canal.of([ 1, 1 ]).distinct().collect();
	expect(result).to.eql([ 1 ]);
});

it("distinct() 1", function()
{
	var result = Canal.of([ 1 ]).distinct().collect();
	expect(result).to.eql([ 1 ]);
});

it("distinct().take(1) 1", function()
{
	var result = Canal.of([ 1 ]).distinct().take(1);
	expect(result).to.eql([ 1 ]);
});

it("distinct() empty", function()
{
	var result = Canal.of([]).distinct().collect();
	expect(result).to.eql([]);
});

});
