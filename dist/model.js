"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seqModel = void 0;
var mongoose = require("mongoose");
exports.seqModel = mongoose.model('seq', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        default: 0
    }
}));
