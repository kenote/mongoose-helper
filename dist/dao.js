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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var zipObject_1 = require("lodash/zipObject");
var MongooseDao = (function () {
    function MongooseDao(Model, options) {
        if (options === void 0) { options = {}; }
        this.populate = { path: '' };
        this.start = function () { return new Promise(function (resolve) { return resolve(0); }); };
        this.model = Model;
        this.name = options.name || Model.modelName;
        if (options.populate) {
            this.populate = options.populate;
        }
        if (options.seqModel) {
            this.seqModel = options.seqModel;
        }
    }
    MongooseDao.prototype.create = function (doc, populate) {
        var _this = this;
        return this.model.create(doc)
            .then(function (res) { return Promise.promisifyAll(res)['populateAsync'](populate || _this.populate); });
    };
    MongooseDao.prototype.insert = function (doc, populate) {
        var _this = this;
        var idName = this.setting.idName;
        var idStart = this.setting.idStart || 1;
        if (!this.seqModel)
            return new Promise(function (resolve) { return resolve(undefined); });
        return this.addAndUpdateKeys(this.name, idStart)
            .then(function (id) {
            var _a;
            return _this.create(__assign({}, doc, (_a = {}, _a[idName || 'id'] = id, _a)), populate);
        });
    };
    MongooseDao.prototype.addAndUpdateKeys = function (name, start) {
        var _this = this;
        if (start === void 0) { start = 1; }
        var idStep = this.setting.idStep || 1;
        return new Promise(function (resolve, reject) {
            _this.seqModel.findOne({ name: name }, function (err, res) { return exports.callback(resolve, reject, err, res); });
        })
            .then(function (doc) {
            if (doc) {
                doc.seq = doc.seq < start ? start : doc.seq + idStep;
                doc.save();
                return doc;
            }
            else {
                return _this.seqModel.create({ name: name, seq: start });
            }
        })
            .then(function (ret) { return ret.seq || 1; });
    };
    MongooseDao.prototype.remove = function (conditions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.model.deleteMany(conditions, function (err) { return exports.callback(resolve, reject, err); });
        });
    };
    MongooseDao.prototype.findOne = function (conditions, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            _this.model.findOne(conditions)
                .populate(options.populate || _this.populate)
                .select(options.select)
                .exec(function (err, res) { return exports.callback(resolve, reject, err, res); });
        });
    };
    MongooseDao.prototype.find = function (conditions, options) {
        var _this = this;
        if (conditions === void 0) { conditions = {}; }
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            _this.model.find(conditions)
                .populate(options.populate || _this.populate)
                .select(options.select)
                .sort(options.sort || { _id: 1 })
                .limit(options.limit || 0)
                .skip(options.skip || 0)
                .exec(function (err, res) { return exports.callback(resolve, reject, err, res); });
        });
    };
    MongooseDao.prototype.counts = function (conditions) {
        var _this = this;
        if (conditions === void 0) { conditions = null; }
        return new Promise(function (resolve, reject) {
            _this.model.countDocuments(conditions, function (err, count) { return exports.callback(resolve, reject, err, count); });
        });
    };
    MongooseDao.prototype.clear = function () {
        var _this = this;
        return this.remove({}).then(function () { return _this.model.collection.dropIndexes(); });
    };
    MongooseDao.prototype.updateOne = function (conditions, doc) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.model.updateOne(conditions, doc, function (err, raw) { return exports.callback(resolve, reject, err, raw); });
        });
    };
    MongooseDao.prototype.update = function (conditions, doc) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.model.update(conditions, doc, function (err, raw) { return exports.callback(resolve, reject, err, raw); });
        });
    };
    MongooseDao.prototype.list = function (conditions, options) {
        if (conditions === void 0) { conditions = {}; }
        if (options === void 0) { options = {}; }
        var limit = options.limit;
        return Promise.all([
            this.find(conditions, options),
            this.counts(conditions)
        ])
            .then(function (fill) { return zipObject_1.default(['data', 'counts', 'limit'], __spread(fill, [limit || 0])); });
    };
    return MongooseDao;
}());
exports.MongooseDao = MongooseDao;
function MongooseDaoSetting(setting) {
    return function (target) {
        target.prototype.setting = __assign({ idName: 'id', idStart: 1, idStep: 1 }, setting);
    };
}
exports.MongooseDaoSetting = MongooseDaoSetting;
exports.callback = function (resolve, reject, err, doc) {
    if (doc === void 0) { doc = null; }
    if (err) {
        reject(err);
    }
    else {
        resolve(doc);
    }
};
