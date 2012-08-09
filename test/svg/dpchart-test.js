test("Series Constructor and getSeries()", function () {
    var data1 = [1, 2, 9],
        data2 = {name1:1, name2:2, name3:3},
        data3 = [
            {Jan:1, Feb:2, Mar:3},
            {Jan:4, Feb:5, Mar:6},
            {Jan:7, Feb:8, Mar:9}
        ],
        data4 = [
            {name:'name1', data:{Jan:1, Feb:2, Mar:3}},
            {name:'name2', data:{Jan:4, Feb:5, Mar:6}},
            {name:'name3', data:{Jan:7, Feb:8, Mar:9}}
        ],
        data5 = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]

    var Series = DPChart.Series

    var series1 = new Series(data1),
        series2 = new Series(data2),
        series3 = new Series(data3),
        series4 = new Series(data4),
        series5 = new Series(data5)


    deepEqual(series1.getSeries(), [
        {data:1},
        {data:2},
        {data:9}
    ], "Data format as [number,....]");
    deepEqual(series2.getSeries(), [
        {data:1, name:"name1"},
        {data:2, name:"name2"},
        {data:3, name:"name3"}
    ], 'Data format as {name:data,...}');
    deepEqual(series3.getSeries(), [
        {data:{Jan:1, Feb:2, Mar:3}},
        {data:{Jan:4, Feb:5, Mar:6}},
        {data:{Jan:7, Feb:8, Mar:9}}
    ], 'Data format as [Object,....]');
    deepEqual(series4.getSeries(), data4, 'Data format as [{name:..,data:..},...]')

    deepEqual(series5.getSeries(), [
        {data:[1, 2, 3]},
        {data:[4, 5, 6]},
        {data:[7, 8, 9]}
    ], 'Data format as [array,...]')


});

test('Series.getRange()', function () {
    var expects = {min:1, max:9}

    var data1 = [1, 2, 3, 4, 5, 6, 7, 8, 9],
        data3 = [
            {Jan:1, Feb:2, Mar:3},
            {Jan:4, Feb:5, Mar:6},
            {Jan:7, Feb:8, Mar:9}
        ],
        data5 = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]

    var Series = DPChart.Series

    var series1 = new Series(data1),
        series3 = new Series(data3),
        series5 = new Series(data5)

    deepEqual(series1.getRange(), expects, 'data property is number, range is {min:1,max:9}')

    deepEqual(series3.getRange(), expects, 'data property is object, range is {min:1,max:9}')

    deepEqual(series5.getRange(), expects, 'data property is array, range is {min:1,max:9}')
})


test('Series.getLabels()', function () {
    var data1 = [1, 2, 9],
        data2 = {name1:1, name2:2, name3:3},
        data3 = [
            {Jan:1, Feb:2, Mar:3},
            {Jan:4, May:5, Mar:6},
            {Jan:7, Feb:8, Mar:9}
        ],
        data4 = [
            {name:'name1', data:{Jan:1, Feb:2, Mar:3}},
            {name:'name2', data:{Jan:4, Feb:5, Mar:6}},
            {name:'name3', data:{Jan:7, Feb:8, Mar:9}}
        ],
        data5 = [
            [1, 2, 3, 6],
            [4, 5, 6],
            [7, 8, 9]
        ],
        data6 = [
            {name:'name1', data:[1, 2, 3, 4]},
            {name:'name2', data:[1, 2, 3, 4]},
            {name:'name3', data:[1, 2, 3, 4]}
        ]

    var Series = DPChart.Series

    var series1 = new Series(data1),
        series2 = new Series(data2),
        series3 = new Series(data3),
        series4 = new Series(data4),
        series5 = new Series(data5),
        series6 = new Series(data6)

    equal(series1.getLabels().length, series1.getSeries().length, "length is equal")
    deepEqual(series1.getLabels(), ['', '', ''], 'data is number and name is empty,labels are array of empty string')
    deepEqual(series2.getLabels(), ['name1', 'name2', 'name3'], 'data is number and has names,labels are names')
    deepEqual(series3.getLabels(), ['Jan', 'Feb', 'Mar', 'May'], 'data is object and name is empty,labels are keys of each item');
    deepEqual(series4.getLabels(), ['Jan', 'Feb', 'Mar'], 'data is object and has names,labels are keys of each item');
    deepEqual(series5.getLabels(), ['', '', '', ''], 'data is array and name is empty,labels are array of empty string');
    deepEqual(series6.getLabels(), ['', '', '', ''], 'data is array and has names,but labels are array of empty string');
})


test('Axis beginX,beginY', function () {
    var axis = new DPChart.Axis({
        beginX:10,
        beginY:20
    }, new DPChart([]), new Raphael(document.getElementById('qunit-fixture')));

    equal(axis.beginX, 10, 'beginX is 10');
    equal(axis.beginY, 20, 'beginY is 20');
});