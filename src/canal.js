/**
 * An FP style framework of data manipulate in javascript.
 */
(function()
{
	var ROOT = (typeof global === "object" && global) || this;

	function Pond()
	{
		this.downstream = null;
	}
	Pond.prototype.accept = function(data) // Boolean
	{
	};
	Pond.prototype.end = function() // Void
	{
	};

	function Desilter()
	{
		this.sediment = this.settle();
	}
	Desilter.prototype = new Pond();
	Desilter.prototype.settle = function() // Sediment
	{
		return [];
	};

	// Intermediate Operators

	function FilterOp(pred)
	{
		this.pred = pred;
	}
	FilterOp.prototype = new Pond();
	FilterOp.prototype.accept = function(d)
	{
		if (this.pred(d))
		{
			return this.downstream.accept(d);
		}
		else
		{
			return true;
		}
	};

	function MapOp(fn)
	{
		this.fn = fn;
	}
	MapOp.prototype = new Pond();
	MapOp.prototype.accept = function(d)
	{
		return this.downstream.accept(this.fn(d));
	};

	// Terminate Operators

	function Terminator()
	{
	}
	Terminator.prototype = new Desilter();
	Terminator.prototype.get = function()
	{
		return this.sediment;
	};

	function TakeOp(num)
	{
		this.num = num;
	}
	TakeOp.prototype = new Terminator();
	TakeOp.prototype.accept = function(d)
	{
		if (this.sediment.length < this.num)
		{
			this.sediment.push(d);
			return true;
		}
		else
		{
			return false;
		}
	};
	TakeOp.prototype.settle = function()
	{
		return [];
	};

	function Canal()
	{
		var self = this;
		var head = null;
		var tail = null;
		var data = null;

		var add = function(pond)
		{
			if (head == null)
			{
				head = pond;
			}
			if (tail != null)
			{
				tail.downstream = pond;
			}
			tail = pond;
			return self;
		};

		this.source = function() //
		{
			if (arguments.length > 0)
			{
				data = arguments[0];
				return self;
			}
			else
			{
				return data;
			}
		};

		// Intermediate Operations

		this.filter = function(pred)
		{
			return add(new FilterOp(pred));
		};

		this.map = function(fn)
		{
			return add(new MapOp(fn));
		};

		// Terminate Operations

		this.evaluate = function(source)
		{
			if (source != null)
			{
				for (i in source)
				{
					if (!head.accept(source[i]))
					{
						break;
					}
				}
				return tail.get();
			}
			else
			{
				return undefined;
			}
		};

		this.take = function(num)
		{
			add(new TakeOp(num));
			return this.evaluate(data);
		};
	}

	Canal.of = function(data)
	{
		return new Canal().source(data);
	};

	ROOT.Canal = Canal;

}.call(this));
