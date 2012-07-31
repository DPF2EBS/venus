test("common", function(){
	ok(DPChart.isObject({}));
	ok(!DPChart.isObject([]));
	ok(!DPChart.isObject(function(){}));
	ok(DPChart.isArray([]));
	ok(!DPChart.isArray({}));
	ok(!DPChart.isArray(function(){}));

	ok(DPChart.isNumber(1));
	ok(!DPChart.isNumber("1"));
	ok(DPChart.isNumber(1.1));
	ok(DPChart.isNumber(0));
	ok(!DPChart.isNumber(function(){}));

});


test("Series", function(){
	var series = new Series([{data:12,label:"chrome"},{data:12,label:"ff"},{data:150,label:"ie"}]);
	deepEqual(series.getRange(),{min:12,max:150});
	deepEqual(series.getSeries(),[{data:12,label:"chrome"},{data:12,label:"ff"},{data:150,label:"ie"}])
	deepEqual(series.getLabels(["chrome","ff", "ie"]));
});