QUnit.test("window()", function(assert)
{
	function sum(mapper)
	{
		return function(rows, begin, end, current)
		{
			return Canal.of(rows, begin, end) //
			.map(mapper) //
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
	]).window(
		Canal.item(sum(function(d){return d.id;}))
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.sex;})
			.as("sum_id"),
		Canal.item(sum(function(d){return d.sal;}))
			.partBy(function(d){return d.grp;}, function(d){return d.sex;})
			.as("sum_sal"),
		Canal.item(sum(function(d){return d.sal;}))
			.partBy(function(d){return d.grp;})
			.orderBy(function(d){return d.sal;})
			.between(null,0)  // From the very first row to current row
			.as("sum_grp")
	).collect();

	assert.propEqual(result, [
	    {"id":3,"sex":2,"grp":0,"sal":2545,"sum_id":4,"sum_sal":2545,"sum_grp":2545},
		{"id":1,"sex":1,"grp":0,"sal":3032,"sum_id":1,"sum_sal":3032,"sum_grp":5577},
		{"id":4,"sex":1,"grp":1,"sal":1894,"sum_id":6,"sum_sal":4047,"sum_grp":1894},
		{"id":2,"sex":1,"grp":1,"sal":2153,"sum_id":6,"sum_sal":4047,"sum_grp":4047}
	]);
});
