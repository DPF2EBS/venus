test("Series", function () {
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


    var expects = {min:1, max:9}

    deepEqual(series1.getRange(), expects, 'data property is number，range is {min:1,max:9}')

    deepEqual(series3.getRange(), expects, 'data property is object, range is {min:1,max:9}')

    deepEqual(series5.getRange(), expects, 'data property is array, range is {min:1,max:9}')
});

test('Series.getRange()', function () {
    ok(1, 'true')
})