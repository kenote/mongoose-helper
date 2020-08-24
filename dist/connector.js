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
exports.MountModels = exports.Connect = exports.Connector = void 0;
var mongoose = require("mongoose");
var _1 = require("./");
var Connector = (function () {
    function Connector() {
    }
    Connector.prototype.connect = function () {
        if (!this.__setting) {
            console.warn('Missing `MongoDB` connection configuration.');
            return;
        }
        var _a = this.__setting, uris = _a.uris, options = _a.options;
        if (Array.isArray(uris))
            uris = uris.join(',');
        mongoose.connect(uris, options || { useNewUrlParser: true, useCreateIndex: true }, function (err) {
            if (err) {
                console.error("connect to " + uris + " error: " + err.message);
                process.exit(1);
            }
        });
    };
    return Connector;
}());
exports.Connector = Connector;
function Connect(setting) {
    return function (target) {
        target.prototype.__setting = setting;
    };
}
exports.Connect = Connect;
function MountModels(models) {
    return function (target) {
        target.prototype.__Models = __assign({ seqModel: _1.seqModel }, models);
    };
}
exports.MountModels = MountModels;
