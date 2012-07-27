test("DPChart", function(){
	ok(true, DPChart.getTickSize(5, 0.1, 0.4));
	ok(true, DPChart.getTickSize(3, 0.1, 0.4));
	ok(true, DPChart.getTickSize(6, 63, 1000));
	ok(true, DPChart.getTickSize(6, 800, 1000));
});

test("Series", function(){
	var series = new Series([{data:12,label:"chrome"},{data:12,label:"ff"},{data:150,label:"ie"}]);
	deepEqual(series.getRange(),{min:12,max:150});
	deepEqual(series.getSeries(),[{data:12,label:"chrome"},{data:12,label:"ff"},{data:150,label:"ie"}])
	deepEqual(series.getLabels(["chrome","ff", "ie"]));
});