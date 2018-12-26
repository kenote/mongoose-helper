"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var MongoDB = (function () {
    function MongoDB() {
        this.__defaultOptions = {
            useNewUrlParser: true,
            useCreateIndex: true
        };
    }
    MongoDB.prototype.connect = function () {
        var _this = this;
        mongoose.connect(this.__setting.uris, this.__setting.options || this.__defaultOptions, function (err) {
            if (err) {
                console.error("connect to " + _this.__setting.uris + " error: " + err.message);
                process.exit(1);
            }
        });
    };
    return MongoDB;
}());
exports.MongoDB = MongoDB;
function MongoSetting(setting) {
    return function (target) {
        target.prototype.__setting = setting;
    };
}
exports.MongoSetting = MongoSetting;
function ModelMount(models) {
    return function (target) {
        target.prototype.__Models = __assign({ seqModel: seqModel }, models);
    };
}
exports.ModelMount = ModelMount;
var seqModel = mongoose.model('seq', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
}));
