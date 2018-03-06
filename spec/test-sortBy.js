var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test sortBy", function(){

it("sortBy() desc", function()
{
	var result = Canal.of([ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 22
	} ]) //
	.sortBy(function(d)
	{
		return d.id;
	}, false).collect();

	expect(result).to.eql([ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 1,
		"score" : 22
	} ]);
});

it("sortBy() asc desc", function()
{
	var result = Canal.of([ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 22
	} ]) //
	.sortBy(function(d)
	{
		return d.id;
	}, function(d)
	{
		return d.score;
	}, false).collect();

	expect(result).to.eql([ {
		"id" : 1,
		"score" : 22
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 3,
		"score" : 32
	} ]);
});

it("sortBy([asc desc])", function()
{
	var result = Canal.of([ {
		"id" : 3,
		"score" : 32
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 1,
		"score" : 22
	} ]) //
	.sortBy([function(d)
	{
		return d.id;
	}, function(d)
	{
		return d.score;
	}, false]).collect();

	expect(result).to.eql([ {
		"id" : 1,
		"score" : 22
	}, {
		"id" : 1,
		"score" : 12
	}, {
		"id" : 2,
		"score" : 23
	}, {
		"id" : 3,
		"score" : 32
	} ]);
});

});
