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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const exceptions_1 = require("../exceptions");
const moment_1 = __importDefault(require("moment"));
class SettingsService {
    constructor() {
        this.repo = new repositories_1.SettingsRepo();
        this.adminRepo = new repositories_1.AdminRepo();
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield this.repo.get();
            if (!settings)
                throw new exceptions_1.ConflictError(`No settings defined yet!`);
            return settings;
        });
    }
    updateSettings(fields, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = (yield this.getSettings());
            const updatedSettings = this.repo.update(settings._id, fields);
            const timeOfUpdate = (0, moment_1.default)().toString();
            const actions = admin.actions;
            Object.keys(fields).map((key) => {
                actions.push({
                    field: key,
                    previous: settings[key],
                    updatedTo: fields[key],
                    updateTime: timeOfUpdate,
                });
            });
            yield this.adminRepo.update(admin._id, { actions });
            return updatedSettings;
        });
    }
    createSettings(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield this.repo.get();
            if (settings)
                throw new exceptions_1.ForbiddenError(`Predefined settings already exist!`);
            return yield this.repo.create(data);
        });
    }
}
exports.default = SettingsService;
//# sourceMappingURL=settings.service.js.map