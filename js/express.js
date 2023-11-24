// 后台获取POI数据

let express = require("express");
const cors = require('cors');
//node里的querystring模块,专门用来处理参数字符串
// let qs=require("querystring");

//创建服务器
let app = express();


// 允许所有域名的跨源请求
app.use(cors());
// 或者，允许特定域名的跨源请求
// app.use(cors({ origin: 'https://example.com' }));


//1.引入body-parser模块
var bp = require('body-parser');
//2.配置body-parser,让所有的post请求都支持body-parser模块,那么所有的req对象就会多一个body属性,里面存储了post请求过来的数据     如何让所有的路由都支持body-parser模块?--使用中间件实现
app.use(bp.urlencoded({ extended: false }));
/*
* express方法调用返回的app有三个监听方法,实现了类似路由的功能,但是本质还是中间件
* get()--用来监听get请求
* post()--用来监听post请求
* all()--用来监听所有请求,一般用来处理跨域问题
*
* 监听方法的参数:
* 参数一:路由
*   a.字符串,如"/favicon.ico","/2-ajax.html"."*";
*   b.正则表达式
* 参数二:回调函数
*   req对象:请求对象--常用属性:
*       1.query 参数对象
*       2.path 文件路径
*       3.hostname 服务器地址
*    res对象:响应对象--常用方法:
*       1.res.json(对象)
*       2.res.jsonp(对象)
*       3.res.send(内容)
*       4.res.sendFile(文件路径)
*       5.res.setHeader()--设置响应头
* */
//响应首部 Access-Control-Allow-Headers 用于 preflight request （预检请求）中，列出了将会在正式请求的 Access-Control-Expose-Headers 字段中出现的首部信息。简单首部，如 simple headers、Accept、Accept-Language、Content-Language、Content-Type （只限于解析后的值为 application/x-www-form-urlencoded、multipart/form-data 或 text/plain 三种MIME类型（不包括参数）），它们始终是被支持的，不需要在这个首部特意列出。
app.all("*", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT,DELETE,OPTIONS');
    next();
});
app.get("/", function (req, res) {
    res.end("响应结束");
});
app.get(/^\/.+\.html$/, function (req, res) {
    res.sendFile(__dirname + req.path);
    // console.log(__dirname);
});


// 开始查询数据库
var pgOpt = require('pg');
var pgConfig = {
    user: 'postgres',
    database: 'postgres',
    password: '123456',
    host: 'localhost',
    port: '5432',
    poolSize: 5,
    poolIdleTimeout: 30000,
    reapIntervalMillis: 10000
};

// 创建连接池
var pgPool = new pgOpt.Pool(pgConfig);
// var pgPool = new pgOpt.pools.getOrCreate(pgConfig);// 低版本的pg模块需要这样来创建连接池


// 响应get请求(返回全部的POI数据)
app.get("/ajaxGet_allPOI", function (req, res) {
    // var X = req.query.X;
    // var Y = req.query.Y;
    // console.log(X, Y, radius);

    // 获取的POI数据
    var myJson = [];
    // 连接数据库
    pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        // 查询数据
        client.query("select * from chinapois;", [], function (isErr, rst) { // points、pois、chinapois
            done();

            if (isErr) {
                console.log('query error:' + isErr.message);
            } else {
                console.log('query success, data is: ');
                var points = rst.rows;
                // return points;
                // console.log(points);

                // 调出所有点的数据，对数据格式进行修整合
                var len = points.length;
                for (var i = 0; i < len; i++) {
                    var tempJson = points[i];
                    
                    // 筛选了苏州市的POI点数据
                    if(tempJson['city']!="苏州") continue;

                    var pname = tempJson['pname'];
                    // var X2 = tempJson['X'];
                    // var Y2 = tempJson['Y'];
                    var X2 = tempJson['X_gcj02'];
                    var Y2 = tempJson['Y_gcj02'];
                    // var score = tempJson['score'];
                    var location = [X2, Y2];
                    var rankInCity = tempJson['rankInCity'];
                    var rankInChina = tempJson['rankInChina'];

                    

                    // 在距离范围内
                    var newJson = {
                        "pname": pname,
                        "X": X2,
                        "Y": Y2,
                        // "score": score,
                        "lnglat": location,
                        "rankInCity": rankInCity,
                        "rankInChina": rankInChina
                    }
                    myJson.push(newJson);
                }

                // 将数据进行返回
                res.json(myJson);
            }
        })
    });


    // res.json({msg:"登陆成功", X:X, Y:Y, radius:radius});

});

// 响应get请求(canvas版main2)（按距离升序返回）
app.get("/ajaxGet_main2", function (req, res) {
    var X = req.query.X;
    var Y = req.query.Y;
    var radius = req.query.radius;
    console.log(X, Y, radius);



    // 获取的POI数据
    var myJson = [];
    // 连接数据库
    pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        // 查询数据
        client.query('select * from chinapois;', [], function (isErr, rst) { // points、pois、chinapois
            done();

            if (isErr) {
                console.log('query error:' + isErr.message);
            } else {
                console.log('query success, data is: ');
                var points = rst.rows;
                // return points;
                // console.log(points);

                // 调出所有点的数据，开始筛选
                var len = points.length;
                var num = 0;
                for (var i = 0; i < len; i++) {
                    var tempJson = points[i];
                    var pname = tempJson['pname'];
                    var X2 = tempJson['X_gcj02'];
                    var Y2 = tempJson['Y_gcj02'];
                    // var X2 = tempJson['X'];
                    // var Y2 = tempJson['Y'];
                    var rankInCity = tempJson['rankInCity'];
                    var rankInChina = tempJson['rankInChina'];
                    // var score = tempJson['score'];
                    var location = [X2, Y2];

                    var distance = GetDistance(X, Y, X2, Y2);
                    // console.log(pname, distance);

                    // 这边还得计算中心点与本点之间的通行时间，或是直接使用距离进行近似
                    // 目前这个通行时间还是错误的，因为中心点不可能一成不变。

                    if (distance < radius) {
                        // 在距离范围内
                        var newJson = {
                            "pname": pname,
                            "X": X2,
                            "Y": Y2,
                            // "score": score,
                            "location": location,
                            // "time": tempJson['time'],
                            "distance": distance
                        }
                        myJson[num] = newJson;
                        num++;
                    }
                }
                // console.log(myJson);

                // 升序排列
                function up(a, b) {
                    return a.distance - b.distance
                }
                // 降序排列
                function down(a, b) {
                    return b.score - a.score
                }

                // sort 会直接对原数据排序
                myJson.sort(up);
                // console.log(myJson);

                // 将数据进行返回
                res.json(myJson);
            }
        })
    });


    // res.json({msg:"登陆成功", X:X, Y:Y, radius:radius});

});

// 响应get请求(canvas版main4)(按得分降序返回)
app.get("/ajaxGet_main4", function (req, res) {
    var X = req.query.X;
    var Y = req.query.Y;
    var radius = req.query.radius;
    console.log(X, Y, radius);

    // 获取的POI数据
    var myJson = [];
    // 连接数据库
    pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        // 查询数据
        client.query('select * from points;', [], function (isErr, rst) { // points、pois
            done();

            if (isErr) {
                console.log('query error:' + isErr.message);
            } else {
                console.log('query success, data is: ');
                var points = rst.rows;
                // return points;
                // console.log(points);

                // 调出所有点的数据，开始筛选
                var len = points.length;
                var num = 0;
                for (var i = 0; i < len; i++) {
                    var tempJson = points[i];
                    var pname = tempJson['pname'];
                    var X2 = tempJson['X'];
                    var Y2 = tempJson['Y'];
                    var score = tempJson['score'];
                    var location = [X2, Y2];

                    var distance = GetDistance(X, Y, X2, Y2);
                    // console.log(pname, distance);

                    // 这边还得计算中心点与本点之间的通行时间，或是直接使用距离进行近似
                    // 目前这个通行时间还是错误的，因为中心点不可能一成不变。

                    if (distance < radius) {
                        // 在距离范围内
                        var newJson = {
                            "pname": pname,
                            "X": X2,
                            "Y": Y2,
                            "score": score,
                            "location": location,
                            // "time": tempJson['time'],
                            "distance": distance
                        }
                        myJson[num] = newJson;
                        num++;
                    }
                }
                // console.log(myJson);

                // 升序排列
                function up(a, b) {
                    return a.distance - b.distance
                }
                // 降序排列
                function down(a, b) {
                    return b.score - a.score
                }

                // sort 会直接对原数据排序
                myJson.sort(down);
                // console.log(myJson);

                // 将数据进行返回
                res.json(myJson);
            }
        })
    });


    // res.json({msg:"登陆成功", X:X, Y:Y, radius:radius});

});


// 响应get请求(D3版)
app.get("/ajaxGet_D3", function (req, res) {
    var X = req.query.X;
    var Y = req.query.Y;
    var radius = req.query.radius;
    console.log(X, Y, radius);

    // 获取的POI数据
    var myJson = [];
    // 连接数据库
    pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        // 查询数据
        client.query('select * from point;', [], function (isErr, rst) { // point、pois
            done();

            if (isErr) {
                console.log('query error:' + isErr.message);
            } else {
                console.log('query success, data is: ');
                var points = rst.rows;
                // return points;
                // console.log(points);

                // 调出所有点的数据，开始筛选
                var len = points.length;
                var num = 0;
                for (var i = 0; i < len; i++) {
                    var tempJson = points[i];
                    var pname = tempJson['pname'];
                    var X2 = tempJson['X'];
                    var Y2 = tempJson['Y'];
                    var score = tempJson['score'];

                    var distance = GetDistance(X, Y, X2, Y2);
                    // console.log(pname, distance);

                    // 这边还得计算中心点与本点之间的通行时间，或是直接使用距离进行近似
                    // 目前这个通行时间还是错误的，因为中心点不可能一成不变。

                    if (distance < radius) {
                        // 在距离范围内
                        var newJson = {
                            "id": num,
                            "title": pname,
                            "lon": X2,
                            "lat": Y2,
                            "grade": score,
                            "location": [X2, Y2],
                            // "time": tempJson['time'],
                            "distance": distance
                        }
                        myJson[num] = newJson;
                        num++;
                    }
                }
                // console.log(myJson);

                // 升序排列
                function up(a, b) {
                    return a.distance - b.distance
                }
                // 降序排列
                function down(a, b) {
                    return b.distance - a.distance
                }

                // sort 会直接对原数据排序
                myJson.sort(up);
                // console.log(myJson);

                // 将数据进行返回
                res.json(myJson);
            }
        })
    });


    // res.json({msg:"登陆成功", X:X, Y:Y, radius:radius});

});




app.post("/ajaxPost", function (req, res) {
    //express里,post请求来的数据不存放在req.query里,post的数据存储在req对象的body属性里,但是需要bodyparser模块的配合
    /*var allData="";
    req.on("data",function (chunk) {
        allData+=chunk;
    })
    req.on("end",function () {
        let queryObj=qs.parse(allData);
        res.send(queryObj.id+queryObj.school);
    })*/
    // console.log(req.body);
    if (req.body.id == "123" && req.body.school == "郑州大学") {
        res.json({
            msg: "登陆成功",
        });
    } else {
        res.send("登录失败");
    }
});
app.get("/ajaxJsonp", function (req, res) {
    res.jsonp({ id: 123, name: "nihao", age: 20, sex: "男" });
});

/*
* 中间件--语法:
* app.use(路由(可省略),回调函数(req,res,next));
* 中间件是在请求的开始和请求的结束之间插入一些额外的操作
* 使用场景:
* 1.处理特殊的请求设置,body-parser
* 2.实现CORS 跨域资源共享(cross-origin-resource-sharing)
* */

//监听端口
app.listen(3333, 'localhost', () => {
    console.log('Server running on http://localhost:3333/..');
});


// 使用连接池
function connectPgWithPool() {
    var pgOpt = require('pg');

    var pgConfig = {
        user: 'postgres',
        database: 'postgres',
        password: '123456',
        host: 'localhost',
        port: '5432',
        poolSize: 5,
        poolIdleTimeout: 30000,
        reapIntervalMillis: 10000
    };

    // 创建连接池
    var pgPool = new pgOpt.Pool(pgConfig);
    // var pgPool = new pgOpt.pools.getOrCreate(pgConfig);// 低版本的pg模块需要这样来创建连接池

    // 连接数据库
    pgPool.connect(function (isErr, client, done) {
        if (isErr) {
            console.log('connect query:' + isErr.message);
            return;
        }
        // 查询数据
        client.query('select * from point;', [], function (isErr, rst) {
            done();
            var myJson = {};
            if (isErr) {
                console.log('query error:' + isErr.message);
            } else {
                console.log('query success, data is: ');
                var points = rst.rows;
                // return points;
                // console.log(points);

                var len = points.length;
                for (var i = 0; i < len; i++) {
                    var tempJson = points[i];
                    myJson[i] = tempJson;
                }
                console.log(myJson);
                return myJson;
            }
        })
    });
}

// 不使用连接池
function connectPgWithoutPool() {
    var conStr = "postgres://postgres:123456@192.168.1.234:5432/postgres";
    var client = new pgOpt.Client(conStr);
    client.connect(function (isErr) {
        if (isErr) {
            console.log('connect error:' + isErr.message);
            client.end();
            return;
        }
        client.query('select now();', [], function (isErr, rst) {
            if (isErr) {
                console.log('query error:' + isErr.message);
            } else {
                console.log('query success, data is: ' + rst.rows[0].now);
            }
            client.end();
        })
    })
}


// 获取两点之间的距离 lat,lng 
function GetDistance2(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10;
    return s;
}

// 获取两点之间的距离 lat,lng 
function GetDistance(lat1, lon1, lat2, lon2) {
    var rad = function (x) {
        return x * Math.PI / 180;
    };

    var R = 6371.393; // 半径 of the earth in km
    var dLat = rad(lat2 - lat1);  // deg2
    var dLon = rad(lon2 - lon1);  // deg2
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // distance in km
    return d*1000;
}


