var Canal = require('../canal.js');
var expect = require("expect.js");

describe("Test on", function(){

it("on() Array", function()
{
	Canal.on(Array);

	var result = [ 1, 2, 3 ].canal().count();

	expect(result).to.eql(3);
});

it("on() Array key", function()
{
	Canal.on(Array, "$");

	var result = [ 1, 2, 3 ].$().count();

	expect(result).to.eql(3);
});

it("on() Array .canal(args)", function()
{
	Canal.on(Array);

	var result = [ 1, 2, 3, 4, 5 ].canal(1, 4).collect();

	expect(result).to.eql([ 2, 3, 4 ]);
});

});
