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
const prisma_1 = require("../src/config/prisma");
const crypto_1 = require("../src/crypto");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const hash = (0, crypto_1.generateHash)('12345');
    yield prisma_1.db.user.create({
        data: {
            name: 'Diogo Alberto Fontes Gomes de Oliveira',
            gitHubPage: 'https://github.com/DiogoAlberto0',
            login: 'Dafgo03',
            password: hash,
            admin: true
        }
    });
});
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.db.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_1.db.$disconnect();
    process.exit(1);
}));
