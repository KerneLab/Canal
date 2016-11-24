QUnit.test("window()", function(assert)
{
	function sum(unpacker)
	{
		return function(rows, begin, end, current)
		{
			return Canal.of(rows, begin, end) //
			.unpack(unpacker) //
			.reduce(function(a, b)
			{
				return a + b;
			}).get();
		};
	}

	var result = Canal.of([
		{"id":1,"sex":1,"grp":0,"sal":3032},
		{"id":2,"sex":1,"grp":1,"sal":2153},
		{"id":3,"sex":2,"grp":0,"sal":2545},
		{"id":4,"sex":1,"grp":1,"sal":1894}
	]).toRows().window(
		Canal.item(sum(function(d){return d.id;}))
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.sex;}),
		Canal.item(sum(function(d){return d.sal;}))
			.partBy(function(d){return d.grp;}, function(d){return d.sex;}),
		Canal.item(sum(function(d){return d.sal;}))
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.sal;})
			.between(null,0)  // From the very first row to current row
	).collect();

	assert.propEqual(result, [
	    [{"id":3,"sex":2,"grp":0,"sal":2545}, 4, 2545, 2545],
		[{"id":1,"sex":1,"grp":0,"sal":3032}, 1, 3032, 5577],
		[{"id":4,"sex":1,"grp":1,"sal":1894}, 6, 4047, 1894],
		[{"id":2,"sex":1,"grp":1,"sal":2153}, 6, 4047, 4047]
	]);
});
