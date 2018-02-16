var cluster = require('cluster'),
    os = require('os');

var fs = require('fs');
var path = require('path');

var config = require('../../../bridge/config/env');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var workers = []; // que of running workers
var restartWorkers = []; // que of restart workers

var TIMEOUT = 120 * 1000; // 2 minutes
var timeout;

var clusterFunc = {};
var appCluster = null;

var exists = fs.existsSync(path.resolve(__dirname, '../../../app/server/config/cluster.js'));
if(exists){
    appCluster = require('../../../app/server/config/cluster');
    clusterFunc.app = appCluster.initClusterFunc;
}


function initWorker (worker) {
    worker.on("message", function (msg) {
        if (msg.cmd && msg.cmd == "workerStart") {
            console.log("(pid: " + msg.pid + ") Server running at " + config.app.port + " " + env + " mode. logging: " + config.db.logging);

            if (restartWorkers.length > 0) {
                if (restartWorkers.length == workers.length) {
                    restartWorkers = [];
                } else {
                    restartWorker(workers[0]);
                }
            }
        } else if (msg.cmd && msg.cmd == "workerClose") {
            console.log("(pid: " + msg.pid + ") Server close");
        } else if (msg.cmd && msg.cmd == "workerRestart") {
            console.log("(pid: " + msg.pid + ") Server restart");
        } else if (msg.cmd && msg.cmd == "restart") {
            restartWorker(workers[0]);
        } else if (msg.cmd && msg.cmd == "close") {
            closeWorker(workers[0]);
        }

        if(appCluster != null) {
            appCluster.initWorker(worker);
        }
    });

    worker.on("disconnect", function () {
        clearTimeout(timeout);
    });
    return worker;
}

function restartWorker (worker) {
    worker.send({cmd: "restart"});
    worker.disconnect();
    timeout = setTimeout(worker.kill, TIMEOUT);
}

function closeWorker (worker) {
    worker.send({cmd: "close"});
    worker.disconnect();
    timeout = setTimeout(worker.kill, TIMEOUT);
}

function gracefulCloseServer (server, code, callback) {
    server.close(function () {
        console.log("exit worker with code: ", code);
        callback(code);
    });

    setTimeout(function () {
        console.log("forcefully exit worker with code: ", code);
        callback(code);
    }, TIMEOUT);
}

function processExit (serverCheck, code) {
    if (!serverCheck.http && !serverCheck.https) {
        process.exit(code);
    }
}


clusterFunc.startCluster =  function (argServer) {
    var app = argServer;
    cluster.schedulingPolicy = cluster.SCHED_RR;

    if(config.flag.isNotUseClusterRoundRobin){
        cluster.schedulingPolicy = cluster.SCHED_NONE;
    }

    if (cluster.isMaster) {
        workers = [];

        var realCpuLength;
        var customCpuLength = config.app.maxClusterLength;
        var cpuLength = os.cpus().length;
        if (customCpuLength == 0 || cpuLength < customCpuLength) {
            realCpuLength = cpuLength;
        } else {
            realCpuLength = customCpuLength;
        }

        console.log("isMaster process running, cpu length:", realCpuLength);

        for (var i = 0; i < realCpuLength; ++i){
            workers.push(initWorker(cluster.fork()));
        }

        cluster.on("exit", function (worker, code, signal) {
            // console.log("exit worker pid : " + worker.process.pid);
            // console.log("exit worker code : " + code);
            // console.log("exit worker signal : " + signal);

            workers.splice(workers.indexOf(worker), 1);
            if (code == 200) {
                restartWorkers.push(worker);
                console.log("restart workers length:", restartWorkers.length);
                workers.push(initWorker(cluster.fork()));
            } else if (code == 100) {
                console.log("rest workers length:", workers.length);
                if (workers.length > 0) closeWorker(workers[0]);
            } else {
                console.log("unexpected exit");
                workers.push(initWorker(cluster.fork()));
            }

        });

    } else if (cluster.isWorker) {

        var serverHttp = null;
        var serverHttps = null;
        var serverCheck = {};

        if (app.http) {
            serverCheck.http = true;
            serverHttp = app.http.listen(config.app.port);
        }
        if (app.https) {
            serverCheck.https = true;
            serverHttps = app.https.listen(config.app.httpsPort);
        }

        process.send({cmd: "workerStart", pid: cluster.worker.process.pid});

        process.on("message", function (msg) {
            if (msg.cmd && msg.cmd == "close") {
                process.send({cmd: "workerClose", pid: cluster.worker.process.pid});

                // initiate graceful close
                if (app.http) {
                    gracefulCloseServer(serverHttp, 100, function (code) {
                        delete serverCheck.http;
                        processExit(serverCheck, code);
                    });
                }
                if (app.https) {
                    gracefulCloseServer(serverHttps, 100, function (code) {
                        delete serverCheck.https;
                        processExit(serverCheck, code);
                    });
                }
            } else if (msg.cmd && msg.cmd == "restart") {
                process.send({cmd: "workerRestart", pid: cluster.worker.process.pid});

                // initiate graceful close
                if (app.http) {
                    gracefulCloseServer(serverHttp, 200, function (code) {
                        delete serverCheck.http;
                        processExit(serverCheck, code);
                    });
                }
                if (app.https) {
                    gracefulCloseServer(serverHttps, 200, function (code) {
                        delete serverCheck.https;
                        processExit(serverCheck, code);
                    });
                }
            }

            if(appCluster != null) {
                appCluster.initMessage(msg);
            }
        });
    } else {
        console.log("start cluster error...")
    }
};

clusterFunc.closeCluster = function () {
    if (cluster.isMaster) {
        closeWorker(workers[0]);
    } else if (cluster.isWorker) {
        process.send({cmd: "close"});
    } else {
        console.log("close cluster error...");
    }
};

clusterFunc.restartCluster =  function () {
    if (cluster.isMaster) {
        restartWorker(workers[0]);
    } else if (cluster.isWorker) {
        process.send({cmd: "restart"});
    } else {
        console.log("restart cluster error...");
    }
};


module.exports = clusterFunc;