var express = require("express");
var path = require("path");
var os = require("os");
var bodyParser = require("body-parser");
var compiler = require("compilex");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var option = { stats: true };
compiler.init(option);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

function getEnvData(lang) {
    const platform = os.platform();
    if (lang === "C" || lang === "C++") {
        const timeout = { timeout: 10000 };
        if (platform === "win32") {
            return { OS: "windows", cmd: "g++", options: timeout };
        } else if (platform === "linux") {
            return { OS: "linux", cmd: "gcc", options: timeout };
        }
    } else if (lang === "Java") {
        return platform === "win32" ? { OS: "windows" } : { OS: "linux", options: { timeout: 10000 } };
    } else if (lang === "Python") {
        return platform === "win32" ? { OS: "windows" } : { OS: "linux", options: { timeout: 10000 } };
    }

    return null;
}


app.post("/compilecode", function (req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    var envData = getEnvData(lang);

    if (!envData) {
        return res.send("Unsupported language or platform");
    }

    if (lang === "C" || lang === "C++") {
        if (inputRadio === "true") {
            compiler.compileCPPWithInput(envData, code, input, function (data) {
                if (data.error) {
                    res.send(data.error);
                } else {
                    res.send(data.output);
                }
            });
        } else {
            compiler.compileCPP(envData, code, function (data) {
                if (data.error) {
                    res.send(data.error);
                } else {
                    res.send(data.output);
                }
            });
        }
    } else if (lang === "Java") {
        if (inputRadio === "true") {
            compiler.compileJavaWithInput(envData, code, input, function (data) {
                if (data.error) {
                    res.send(data.error);
                } else {
                    res.send(data.output);
                }
            });
        } else {
            compiler.compileJava(envData, code, function (data) {
                if (data.error) {
                    res.send(data.error);
                } else {
                    res.send(data.output);
                }
            });
        }
    } else if (lang === "Python") {
        if (inputRadio === "true") {
            compiler.compilePythonWithInput(envData, code, input, function (data) {
                if (data.error) {
                    res.send(data.error);
                } else {
                    res.send(data.output);
                }
            });
        } else {
            compiler.compilePython(envData, code, function (data) {
                if (data.error) {
                    res.send(data.error);
                } else {
                    res.send(data.output);
                }
            });
        }
    }
});

app.get("/fullStat", function (req, res) {
    compiler.fullStat(function (data) {
        res.send(data);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});


compiler.flush(function () {
    console.log("All temporary files flushed!");
});
