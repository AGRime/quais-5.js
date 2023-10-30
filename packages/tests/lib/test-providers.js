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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
//import Web3HttpProvider from "web3-providers-http";
var quais_1 = require("quais");
var utils_1 = require("./utils");
var bnify = quais_1.quais.BigNumber.from;
var blockchainData = {
    homestead: {
        addresses: [
            {
                address: "0xAC1639CF97a3A46D431e6d1216f576622894cBB5",
                balance: bnify("4813414100000000"),
                code: "0x"
            },
        ],
        blocks: [
            {
                hash: "0x3d6122660cc824376f11ee842f83addc3525e2dd6756b9bcf0affa6aa88cf741",
                parentHash: "0xb495a1d7e6663152ae92708da4843337b958146015a2802f4193a410044698c9",
                number: 3,
                timestamp: 1438270048,
                nonce: "0x2e9344e0cbde83ce",
                difficulty: 17154715646,
                gasLimit: bnify("0x1388"),
                gasUsed: bnify("0"),
                miner: "0x5088D623ba0fcf0131E0897a91734A4D83596AA0",
                extraData: "0x476574682f76312e302e302d66633739643332642f6c696e75782f676f312e34",
                transactions: []
            }
        ],
        transactions: [
            {}
        ],
        transactionReceipts: [
            {},
        ]
    },
};
blockchainData["default"] = blockchainData.homestead;
function equals(name, actual, expected) {
    if (expected && expected.eq) {
        if (actual == null) {
            assert_1.default.ok(false, name + " - actual big number null");
        }
        expected = quais_1.quais.BigNumber.from(expected);
        actual = quais_1.quais.BigNumber.from(actual);
        assert_1.default.ok(expected.eq(actual), name + " matches");
    }
    else if (Array.isArray(expected)) {
        if (actual == null) {
            assert_1.default.ok(false, name + " - actual array null");
        }
        assert_1.default.equal(actual.length, expected.length, name + " array lengths match");
        for (var i = 0; i < expected.length; i++) {
            equals("(" + name + " - item " + i + ")", actual[i], expected[i]);
        }
    }
    else if (typeof (expected) === "object") {
        if (actual == null) {
            if (expected === actual) {
                return;
            }
            assert_1.default.ok(false, name + " - actual object null");
        }
        var keys_1 = {};
        Object.keys(expected).forEach(function (key) { keys_1[key] = true; });
        Object.keys(actual).forEach(function (key) { keys_1[key] = true; });
        Object.keys(keys_1).forEach(function (key) {
            equals("(" + name + " - key + " + key + ")", actual[key], expected[key]);
        });
    }
    else {
        if (actual == null) {
            assert_1.default.ok(false, name + " - actual null");
        }
        assert_1.default.equal(actual, expected, name + " matches");
    }
}
function waiter(duration) {
    return new Promise(function (resolve) {
        var timer = setTimeout(resolve, duration);
        if (timer.unref) {
            timer.unref();
        }
    });
}
var allNetworks = ["default", "homestead"];
var providerFunctions = [
    {
        name: "getDefaultProvider",
        networks: allNetworks,
        create: function (network) {
            if (network == "default") {
                return quais_1.quais.getDefaultProvider(process.env.CYPRUS1URL);
            }
            return quais_1.quais.getDefaultProvider(process.env.CYPRUS1URL);
        }
    },
];
var fundWallet;
do {
    fundWallet = quais_1.quais.Wallet.createRandom();
    var firstPart = parseInt(fundWallet.address.slice(2, 4), 16);
} while (firstPart > 29); //0x1D in hex, keep generating until cyprus1 addr
var testFunctions = [];
Object.keys(blockchainData).forEach(function (network) {
    function addSimpleTest(name, func, expected) {
        var _this = this;
        testFunctions.push({
            name: name,
            networks: [network],
            execute: function (provider) { return __awaiter(_this, void 0, void 0, function () {
                var value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, func(provider)];
                        case 1:
                            value = _a.sent();
                            equals(name, expected, value);
                            return [2 /*return*/];
                    }
                });
            }); }
        });
    }
    function addObjectTest(name, func, expected, checkSkip) {
        var _this = this;
        testFunctions.push({
            name: name,
            networks: [network],
            checkSkip: checkSkip,
            execute: function (provider) { return __awaiter(_this, void 0, void 0, function () {
                var value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, func(provider)];
                        case 1:
                            value = _a.sent();
                            Object.keys(expected).forEach(function (key) {
                                equals(name + "." + key, value[key], expected[key]);
                            });
                            return [2 /*return*/];
                    }
                });
            }); }
        });
    }
    var tests = blockchainData[network];
    // And address test case can have any of the following:
    // - balance
    // - code
    // - storage
    // - ENS name
    tests.addresses.forEach(function (test) {
        if (test.balance) {
            addSimpleTest("fetches account balance: " + test.address, function (provider) {
                return provider.getBalance(test.address);
            }, test.balance);
        }
        if (test.code) {
            addSimpleTest("fetches account code: " + test.address, function (provider) {
                return provider.getCode(test.address);
            }, test.code);
        }
        if (test.storage) {
            Object.keys(test.storage).forEach(function (position) {
                addSimpleTest("fetches storage: " + test.address + ":" + position, function (provider) {
                    return provider.getStorageAt(test.address, bnify(position));
                }, test.storage[position]);
            });
        }
        if (test.name) {
            addSimpleTest("fetches ENS name: " + test.address, function (provider) {
                return provider.resolveName(test.name);
            }, test.address);
        }
    });
    tests.blocks.forEach(function (test) {
        addObjectTest("fetches block (by number) #" + test.number, function (provider) {
            return provider.getBlock(test.number);
        }, test);
    });
    tests.blocks.forEach(function (test) {
        addObjectTest("fetches block (by hash) " + test.hash, function (provider) {
            return provider.getBlock(test.hash);
        }, test, function (provider, network, test) {
            return (provider === "EtherscanProvider");
        });
    });
    tests.transactions.forEach(function (test) {
        var hash = test.hash;
        addObjectTest("fetches transaction " + hash, function (provider) { return __awaiter(void 0, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.getTransaction(hash)];
                    case 1:
                        tx = _a.sent();
                        // This changes with every block
                        assert_1.default.equal(typeof (tx.confirmations), "number", "confirmations is a number");
                        delete tx.confirmations;
                        assert_1.default.equal(typeof (tx.wait), "function", "wait is a function");
                        delete tx.wait;
                        return [2 /*return*/, tx];
                }
            });
        }); }, test, function (provider, network, test) {
            // Temporary; pocket is being broken again for old transactions
            return provider === "PocketProvider";
            //return false;
        });
    });
    tests.transactionReceipts.forEach(function (test) {
        var hash = test.transactionHash;
        addObjectTest("fetches transaction receipt " + hash, function (provider) { return __awaiter(void 0, void 0, void 0, function () {
            var receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.getTransactionReceipt(hash)];
                    case 1:
                        receipt = _a.sent();
                        assert_1.default.ok(!!receipt, "missing receipt");
                        if (test.status === null) {
                            assert_1.default.ok(receipt.status === undefined, "no status");
                            receipt.status = null;
                        }
                        // This changes with every block; so just make sure it is a number
                        assert_1.default.equal(typeof (receipt.confirmations), "number", "confirmations is a number");
                        delete receipt.confirmations;
                        return [2 /*return*/, receipt];
                }
            });
        }); }, test, function (provider, network, test) {
            // Temporary; pocket is being broken again for old transactions
            return provider === "PocketProvider";
            //return false;
        });
    });
});
(function () {
    var _this = this;
    function addErrorTest(code, func) {
        var _this = this;
        testFunctions.push({
            name: "throws correct " + code + " error",
            networks: ["goerli"],
            checkSkip: function (provider, network, test) {
                return false;
            },
            execute: function (provider) { return __awaiter(_this, void 0, void 0, function () {
                var value, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, func(provider)];
                        case 1:
                            value = _a.sent();
                            console.log(value);
                            assert_1.default.ok(false, "did not throw");
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            assert_1.default.equal(error_1.code, code, "incorrect error thrown: actual:" + error_1.code + " != expected:" + code);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        });
    }
    // Wallet(id("foobar1234"))
    addErrorTest(quais_1.quais.utils.Logger.errors.NONCE_EXPIRED, function (provider) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, provider.sendTransaction("0x02f86e05808459682f008459682f14830186a09475544911a6f2e69ceea374f3f7e5ea9c987ece098304cb2f80c001a0d9585a780dde9e7d8c855aacec0564054b49114931fd7e320e4e983009d864f7a050bee916f2770ef17367256d8bccfbc49885467a6ba27cf5cc57e8553c73a191")];
        });
    }); });
    addErrorTest(quais_1.quais.utils.Logger.errors.INSUFFICIENT_FUNDS, function (provider) { return __awaiter(_this, void 0, void 0, function () {
        var txProps, wallet, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    txProps = {
                        to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
                        gasPrice: 9000000000,
                        gasLimit: 21000,
                        chainId: 5,
                        value: 1,
                    };
                    wallet = quais_1.quais.Wallet.createRandom();
                    return [4 /*yield*/, wallet.signTransaction(txProps)];
                case 1:
                    tx = _a.sent();
                    return [2 /*return*/, provider.sendTransaction(tx)];
            }
        });
    }); });
    addErrorTest(quais_1.quais.utils.Logger.errors.INSUFFICIENT_FUNDS, function (provider) { return __awaiter(_this, void 0, void 0, function () {
        var txProps, wallet;
        return __generator(this, function (_a) {
            txProps = {
                to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
                gasPrice: 9000000000,
                gasLimit: 21000,
                value: 1,
            };
            wallet = quais_1.quais.Wallet.createRandom().connect(provider);
            return [2 /*return*/, wallet.sendTransaction(txProps)];
        });
    }); });
    addErrorTest(quais_1.quais.utils.Logger.errors.UNPREDICTABLE_GAS_LIMIT, function (provider) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, provider.estimateGas({
                    to: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" // ENS contract
                })];
        });
    }); });
})();
describe.skip("Test Provider Methods", function () {
    var fundReceipt = null;
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.timeout(300000);
                // Get some ether from the faucet
                //const funder = await quais.utils.fetchJson(`https:/\/api.quais.io/api/v1/?action=fundAccount&address=${ fundWallet.address.toLowerCase() }`);
                fundReceipt = (0, utils_1.fundAddress)(fundWallet.address).then(function (hash) {
                    console.log("*** Funded: " + fundWallet.address);
                    return hash;
                });
                return [2 /*return*/];
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(300000);
                        // Wait until the funding is complete
                        return [4 /*yield*/, fundReceipt];
                    case 1:
                        // Wait until the funding is complete
                        _a.sent();
                        return [4 /*yield*/, (0, utils_1.returnFunds)(fundWallet)];
                    case 2:
                        hash = _a.sent();
                        console.log("*** Sweep Transaction:", hash);
                        return [2 /*return*/];
                }
            });
        });
    });
    providerFunctions.forEach(function (_a) {
        var name = _a.name, networks = _a.networks, create = _a.create;
        networks.forEach(function (network) {
            var provider = create(network);
            testFunctions.forEach(function (test) {
                // Skip tests not supported on this network
                if (test.networks.indexOf(network) === -1) {
                    return;
                }
                if (test.checkSkip && test.checkSkip(name, network, test)) {
                    return;
                }
                // How many attempts to try?
                var attempts = (test.attempts != null) ? test.attempts : 3;
                var timeout = (test.timeout != null) ? test.timeout : 60;
                var extras = (test.extras || []).reduce(function (accum, key) {
                    accum[key] = true;
                    return accum;
                }, {});
                it(name + "." + (network ? network : "default") + " " + test.name, function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var error, attempt, result, attemptError_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    // Multiply by 2 to make sure this never happens; we want our
                                    // timeout logic to success, not allow a done() called multiple
                                    // times because our logic returns after the timeout has occurred.
                                    this.timeout(2 * (1000 + timeout * 1000 * attempts));
                                    if (!extras.funding) return [3 /*break*/, 2];
                                    return [4 /*yield*/, fundReceipt];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!!extras.nowait) return [3 /*break*/, 4];
                                    return [4 /*yield*/, waiter(1000)];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    error = null;
                                    attempt = 0;
                                    _a.label = 5;
                                case 5:
                                    if (!(attempt < attempts)) return [3 /*break*/, 11];
                                    _a.label = 6;
                                case 6:
                                    _a.trys.push([6, 8, , 10]);
                                    return [4 /*yield*/, Promise.race([
                                            test.execute(provider),
                                            waiter(timeout * 1000).then(function (result) { throw new Error("timeout"); })
                                        ])];
                                case 7:
                                    result = _a.sent();
                                    return [2 /*return*/, result];
                                case 8:
                                    attemptError_1 = _a.sent();
                                    console.log("*** Failed attempt " + (attempt + 1) + ": " + attemptError_1.message);
                                    error = attemptError_1;
                                    // On failure, wait 5s
                                    return [4 /*yield*/, waiter(5000)];
                                case 9:
                                    // On failure, wait 5s
                                    _a.sent();
                                    return [3 /*break*/, 10];
                                case 10:
                                    attempt++;
                                    return [3 /*break*/, 5];
                                case 11: throw error;
                            }
                        });
                    });
                });
            });
        });
    });
});
describe.skip("Test WebSocketProvider", function () {
    this.retries(3);
    function testWebSocketProvider(provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.destroy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    it("InfuraProvider.getWebSocketProvider", function () {
        return __awaiter(this, void 0, void 0, function () {
            var provider;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = quais_1.quais.providers.InfuraProvider.getWebSocketProvider();
                        return [4 /*yield*/, testWebSocketProvider(provider)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
});
//Poling diasabled as of Oct 24 2023
describe.skip("Test Events", function () {
    this.retries(3);
    function testBlockEvent(provider) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var firstBlockNumber = null;
                        var handler = function (blockNumber) {
                            if (firstBlockNumber == null) {
                                firstBlockNumber = blockNumber;
                                return;
                            }
                            provider.removeListener("block", handler);
                            if (firstBlockNumber + 1 === blockNumber) {
                                resolve(true);
                            }
                            else {
                                reject(new Error("blockNumber fail"));
                            }
                        };
                        provider.on("block", handler);
                    })];
            });
        });
    }
    it("InfuraProvider", function () {
        return __awaiter(this, void 0, void 0, function () {
            var provider;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(60000);
                        provider = new quais_1.quais.providers.InfuraProvider("goerli");
                        return [4 /*yield*/, testBlockEvent(provider)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=test-providers.js.map