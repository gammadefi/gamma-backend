"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const mongoose_1 = require("mongoose");
class SettingsController {
    constructor() {
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const settings = yield this.service.getSettings();
                return res.status(200).json({ status: "success", data: settings });
            }
            catch (err) {
                next(err);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                const updatedSettings = yield this.service.updateSettings(req.body, admin);
                return res.status(200).json({ status: "success", data: updatedSettings });
            }
            catch (err) {
                next(err);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.admin;
                const settings = yield this.service.createSettings(Object.assign({ createdBy: new mongoose_1.Types.ObjectId(admin._id) }, req.body));
                return res.status(201).json({ status: "success", data: settings });
            }
            catch (err) {
                next(err);
            }
        });
        this.service = new services_1.SettingsService();
    }
}
exports.default = SettingsController;
//# sourceMappingURL=settings.controller.js.map