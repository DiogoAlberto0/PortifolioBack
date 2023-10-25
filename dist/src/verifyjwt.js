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
exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJwt = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        return ({ auth: false, message: 'No token provided.', decoded: null });
    const resp = yield jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err)
                return ({ auth: false, message: 'Failed to authenticate token.', decoded: null });
            return ({ auth: true, message: 'Authenticated with success', decoded: decoded });
        });
    });
    return resp;
});
exports.verifyJwt = verifyJwt;
