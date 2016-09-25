/**
 * A FP style framework of data manipulate in javascript.
 */
function Canal()
{
	this.data = null;
	this.source = null;
	this.operator = null;

	switch (arguments.length)
	{
		case 0:
			break;

		case 1: // data
			this.data = new Canal.DataSource(arguments[0]);
			break;

		case 2: // source,intermediate
			this.source = arguments[0];
			this.operator = arguments[1];
			break;
	}
}

// /////////////////Basic////////////////

Canal.prototype.next = function()
{
	if (this.data != null)
	{
		return this.data.next();
	}
	else
	{
		return this.operator(this.source.next());
	}
};

// /////////////////Convert////////////////

Canal.prototype.map = function(f)
{
	return new Canal(this, f);
};

// /////////////////Taking////////////////

Canal.prototype.collect = function() // Array
{
	var result = [];
	while ((v = this.next()) !== undefined)
	{
		result.push(v);
	}
	return result;
};

Canal.DataSource = function(data)
{
	this.data = data;
	this.index = 0;
};

Canal.DataSource.prototype.next = function()
{
	if (this.index < this.data.length)
	{
		return this.data[this.index++];
	}
	else
	{
		return undefined;
	}
};

Canal.derive = function(sub)
{
	var hyp = arguments.length > 1 ? arguments[1] : new Canal();
	sub.prototype = hyp;
	sub.prototype.constructor = sub;
	sub.prototype.hyper = hyp;
};
