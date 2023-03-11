"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
exports.default = (resource) => {
    return (req, res, next) => {
        if (resource === "admin" && !req.admin) {
            throw new exceptions_1.UnauthorizedError("Not signed in, please sign in as an admin to continue!");
        }
        else if (resource === "user" && !req.user) {
            throw new exceptions_1.UnauthorizedError("Not signed in, please sign in as user to continue!");
        }
        next();
    };
};
//# sourceMappingURL=checkResources.js.map