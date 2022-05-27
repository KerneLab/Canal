var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test mapJoint", function(){

it("mapJoint()", function()
{
	var result = Canal.of([ [ "key", [ "L", "0" ] ] ]).mapJoint(function(l, r, k)
	{
		return k + ":" + "(" + l + "," + r + ")";
	}).collect();
	expect(result).to.eql([ "key:(L,0)" ]);
});

it("mapJoint() row", function()
{
	var left = [
		{"id":1,"name":"mike"},
		{"id":2,"name":"john"}
	];
	var right = [
		{"id":1,"sal":100}
	];
	var result = Canal.of(left).keyBy(Canal.col("id"))	//
				.leftJoin(Canal.of(right).keyBy(Canal.col("id"))) //
				.mapJoint(function(l,r){
					var a = Canal.Some(l);
					return Canal.row(a.col("*"),
									 r.col("sal"),
									 r.col(function(d){return Canal.nvl(d.sal,0)+1}).as("sal1"),
									 a.col(null).as("null"));
				}).collect();
	expect(result).to.eql([
		{"id":1,"name":"mike","sal":100,"sal1":101,"null":null},
		{"id":2,"name":"john","sal":undefined,"sal1":1,"null":null}
	]);
});

it("mapJoint() map", function()
{
	var left = [
		{"id":1,"name":"mike"},
		{"id":2,"name":"john"}
	];
	var right = [
		{"id":1,"sal":100}
	];
	var result = Canal.of(left).keyBy(Canal.col("id"))	//
				.leftJoin(Canal.of(right).keyBy(Canal.col("id"))) //
				.mapJoint(function(l,r){
					var a = Canal.Some(l);
					return Canal.row({"*":a.col("*"),
									 "sal":r.col("sal"),
									 "sal1":r.col(function(d){return Canal.nvl(d.sal,0)+1}),
									 "null":a.col(null)});
				}).collect();
	expect(result).to.eql([
		{"id":1,"name":"mike","sal":100,"sal1":101,"null":null},
		{"id":2,"name":"john","sal":undefined,"sal1":1,"null":null}
	]);
});

});
