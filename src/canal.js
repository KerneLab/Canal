/**
 * An FP style framework of data manipulate in javascript.
 */
(function()
{
	var root = (typeof global === "object" && global) || this;

	function Canal()
	{
		this.source = [];

		this.index = 0;

		this.operator = function(d)
		{
			return d;
		};

		switch (arguments.length)
		{
			case 0:
				break;

			case 1: // Array
				// TODO direct source
				this.source.push(new CanalSource(arguments[0]));
				break;

			case 2: // source,intermediate
				this.source.push(arguments[0]);
				this.operator = arguments[1];
				break;
		}
	}

	// /////////////////Basic////////////////

	Canal.prototype.gather = function()
	{
		// TODO
	};

	Canal.prototype.iterator = function()
	{
		return new CanalIterator(this);
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
		var iter = this.iterator();

		while (iter.hasNext())
		{
			result.push(iter.next());
		}
		return result;
	};

	// /////////////////Class////////////////

	function CanalIterator(canal)
	{
		this.canal = canal;
		this.index = 0;
		this.iter = undefined;
		this.value = undefined;
	}

	CanalIterator.prototype.hasNext = function()
	{
		while (this.index < this.canal.source.length && this.index >= 0)
		{
			if (this.iter === undefined)
			{
				this.iter = this.canal.source[this.index].iterator();
			}

			if (this.iter.hasNext())
			{
				this.value = this.iter.next();
				return true;
			}
			else
			{
				this.index++;
				this.iter = undefined;
			}
		}
		return false;
	};

	CanalIterator.prototype.next = function()
	{
		return this.canal.operator(this.value);
	};

	// ============================

	function SourceIterator(source)
	{
		this.source = source;
		this.index = 0;
		this.value = undefined;
	}

	SourceIterator.prototype.hasNext = function() // Boolean
	{
		this.value = this.source.get(this.index++);
		return this.value !== undefined;
	};

	SourceIterator.prototype.next = function() // Object
	{
		return this.value;
	};

	// ============================

	function CanalSource(data)
	{
		this.data = data;
	}

	CanalSource.prototype.iterator = function()
	{
		return new SourceIterator(this);
	};

	CanalSource.prototype.get = function(index)
	{
		if (index < this.data.length)
		{
			return this.data[index];
		}
		else
		{
			return undefined;
		}
	};

	// Canal.derive = function(sub)
	// {
	// var hyp = arguments.length > 1 ? arguments[1] : new Canal();
	// sub.prototype = hyp;
	// sub.prototype.constructor = sub;
	// sub.prototype.hyper = hyp;
	// };

	root.Canal = Canal;
}.call(this));
