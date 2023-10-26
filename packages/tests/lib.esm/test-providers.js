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
import assert from "assert";
//import Web3HttpProvider from "web3-providers-http";
import { quais } from "quais";
import { fundAddress, returnFunds } from "./utils";
const bnify = quais.BigNumber.from;
const blockchainData = {
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
            assert.ok(false, name + " - actual big number null");
        }
        expected = quais.BigNumber.from(expected);
        actual = quais.BigNumber.from(actual);
        assert.ok(expected.eq(actual), name + " matches");
    }
    else if (Array.isArray(expected)) {
        if (actual == null) {
            assert.ok(false, name + " - actual array null");
        }
        assert.equal(actual.length, expected.length, name + " array lengths match");
        for (let i = 0; i < expected.length; i++) {
            equals("(" + name + " - item " + i + ")", actual[i], expected[i]);
        }
    }
    else if (typeof (expected) === "object") {
        if (actual == null) {
            if (expected === actual) {
                return;
            }
            assert.ok(false, name + " - actual object null");
        }
        let keys = {};
        Object.keys(expected).forEach((key) => { keys[key] = true; });
        Object.keys(actual).forEach((key) => { keys[key] = true; });
        Object.keys(keys).forEach((key) => {
            equals("(" + name + " - key + " + key + ")", actual[key], expected[key]);
        });
    }
    else {
        if (actual == null) {
            assert.ok(false, name + " - actual null");
        }
        assert.equal(actual, expected, name + " matches");
    }
}
function waiter(duration) {
    return new Promise((resolve) => {
        const timer = setTimeout(resolve, duration);
        if (timer.unref) {
            timer.unref();
        }
    });
}
const allNetworks = ["default", "homestead"];
const providerFunctions = [
    {
        name: "getDefaultProvider",
        networks: allNetworks,
        create: (network) => {
            if (network == "default") {
                return quais.getDefaultProvider(process.env.CYPRUS1URL);
            }
            return quais.getDefaultProvider(process.env.CYPRUS1URL);
        }
    },
];
let fundWallet;
do {
    fundWallet = quais.Wallet.createRandom();
    var firstPart = parseInt(fundWallet.address.slice(2, 4), 16);
} while (firstPart > 29); //0x1D in hex, keep generating until cyprus1 addr
const testFunctions = [];
Object.keys(blockchainData).forEach((network) => {
    function addSimpleTest(name, func, expected) {
        testFunctions.push({
            name: name,
            networks: [network],
            execute: (provider) => __awaiter(this, void 0, void 0, function* () {
                const value = yield func(provider);
                equals(name, expected, value);
            })
        });
    }
    function addObjectTest(name, func, expected, checkSkip) {
        testFunctions.push({
            name,
            networks: [network],
            checkSkip,
            execute: (provider) => __awaiter(this, void 0, void 0, function* () {
                const value = yield func(provider);
                Object.keys(expected).forEach((key) => {
                    equals(`${name}.${key}`, value[key], expected[key]);
                });
            })
        });
    }
    const tests = blockchainData[network];
    // And address test case can have any of the following:
    // - balance
    // - code
    // - storage
    // - ENS name
    tests.addresses.forEach((test) => {
        if (test.balance) {
            addSimpleTest(`fetches account balance: ${test.address}`, (provider) => {
                return provider.getBalance(test.address);
            }, test.balance);
        }
        if (test.code) {
            addSimpleTest(`fetches account code: ${test.address}`, (provider) => {
                return provider.getCode(test.address);
            }, test.code);
        }
        if (test.storage) {
            Object.keys(test.storage).forEach((position) => {
                addSimpleTest(`fetches storage: ${test.address}:${position}`, (provider) => {
                    return provider.getStorageAt(test.address, bnify(position));
                }, test.storage[position]);
            });
        }
        if (test.name) {
            addSimpleTest(`fetches ENS name: ${test.address}`, (provider) => {
                return provider.resolveName(test.name);
            }, test.address);
        }
    });
    tests.blocks.forEach((test) => {
        addObjectTest(`fetches block (by number) #${test.number}`, (provider) => {
            return provider.getBlock(test.number);
        }, test);
    });
    tests.blocks.forEach((test) => {
        addObjectTest(`fetches block (by hash) ${test.hash}`, (provider) => {
            return provider.getBlock(test.hash);
        }, test, (provider, network, test) => {
            return (provider === "EtherscanProvider");
        });
    });
    tests.transactions.forEach((test) => {
        const hash = test.hash;
        addObjectTest(`fetches transaction ${hash}`, (provider) => __awaiter(void 0, void 0, void 0, function* () {
            const tx = yield provider.getTransaction(hash);
            // This changes with every block
            assert.equal(typeof (tx.confirmations), "number", "confirmations is a number");
            delete tx.confirmations;
            assert.equal(typeof (tx.wait), "function", "wait is a function");
            delete tx.wait;
            return tx;
        }), test, (provider, network, test) => {
            // Temporary; pocket is being broken again for old transactions
            return provider === "PocketProvider";
            //return false;
        });
    });
    tests.transactionReceipts.forEach((test) => {
        const hash = test.transactionHash;
        addObjectTest(`fetches transaction receipt ${hash}`, (provider) => __awaiter(void 0, void 0, void 0, function* () {
            const receipt = yield provider.getTransactionReceipt(hash);
            assert.ok(!!receipt, "missing receipt");
            if (test.status === null) {
                assert.ok(receipt.status === undefined, "no status");
                receipt.status = null;
            }
            // This changes with every block; so just make sure it is a number
            assert.equal(typeof (receipt.confirmations), "number", "confirmations is a number");
            delete receipt.confirmations;
            return receipt;
        }), test, (provider, network, test) => {
            // Temporary; pocket is being broken again for old transactions
            return provider === "PocketProvider";
            //return false;
        });
    });
});
(function () {
    function addErrorTest(code, func) {
        testFunctions.push({
            name: `throws correct ${code} error`,
            networks: ["goerli"],
            checkSkip: (provider, network, test) => {
                return false;
            },
            execute: (provider) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const value = yield func(provider);
                    console.log(value);
                    assert.ok(false, "did not throw");
                }
                catch (error) {
                    assert.equal(error.code, code, `incorrect error thrown: actual:${error.code} != expected:${code}`);
                }
            })
        });
    }
    // Wallet(id("foobar1234"))
    addErrorTest(quais.utils.Logger.errors.NONCE_EXPIRED, (provider) => __awaiter(this, void 0, void 0, function* () {
        return provider.sendTransaction("0x02f86e05808459682f008459682f14830186a09475544911a6f2e69ceea374f3f7e5ea9c987ece098304cb2f80c001a0d9585a780dde9e7d8c855aacec0564054b49114931fd7e320e4e983009d864f7a050bee916f2770ef17367256d8bccfbc49885467a6ba27cf5cc57e8553c73a191");
    }));
    addErrorTest(quais.utils.Logger.errors.INSUFFICIENT_FUNDS, (provider) => __awaiter(this, void 0, void 0, function* () {
        const txProps = {
            to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
            gasPrice: 9000000000,
            gasLimit: 21000,
            chainId: 5,
            value: 1,
        };
        const wallet = quais.Wallet.createRandom();
        const tx = yield wallet.signTransaction(txProps);
        return provider.sendTransaction(tx);
    }));
    addErrorTest(quais.utils.Logger.errors.INSUFFICIENT_FUNDS, (provider) => __awaiter(this, void 0, void 0, function* () {
        const txProps = {
            to: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
            gasPrice: 9000000000,
            gasLimit: 21000,
            value: 1,
        };
        const wallet = quais.Wallet.createRandom().connect(provider);
        return wallet.sendTransaction(txProps);
    }));
    addErrorTest(quais.utils.Logger.errors.UNPREDICTABLE_GAS_LIMIT, (provider) => __awaiter(this, void 0, void 0, function* () {
        return provider.estimateGas({
            to: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" // ENS contract
        });
    }));
})();
describe.skip("Test Provider Methods", function () {
    let fundReceipt = null;
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(300000);
            // Get some ether from the faucet
            //const funder = await quais.utils.fetchJson(`https:/\/api.quais.io/api/v1/?action=fundAccount&address=${ fundWallet.address.toLowerCase() }`);
            fundReceipt = fundAddress(fundWallet.address).then((hash) => {
                console.log(`*** Funded: ${fundWallet.address}`);
                return hash;
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(300000);
            // Wait until the funding is complete
            yield fundReceipt;
            // Refund all unused ether to the faucet
            const hash = yield returnFunds(fundWallet);
            console.log(`*** Sweep Transaction:`, hash);
        });
    });
    providerFunctions.forEach(({ name, networks, create }) => {
        networks.forEach((network) => {
            const provider = create(network);
            testFunctions.forEach((test) => {
                // Skip tests not supported on this network
                if (test.networks.indexOf(network) === -1) {
                    return;
                }
                if (test.checkSkip && test.checkSkip(name, network, test)) {
                    return;
                }
                // How many attempts to try?
                const attempts = (test.attempts != null) ? test.attempts : 3;
                const timeout = (test.timeout != null) ? test.timeout : 60;
                const extras = (test.extras || []).reduce((accum, key) => {
                    accum[key] = true;
                    return accum;
                }, {});
                it(`${name}.${network ? network : "default"} ${test.name}`, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        // Multiply by 2 to make sure this never happens; we want our
                        // timeout logic to success, not allow a done() called multiple
                        // times because our logic returns after the timeout has occurred.
                        this.timeout(2 * (1000 + timeout * 1000 * attempts));
                        // Wait for the funding transaction to be mined
                        if (extras.funding) {
                            yield fundReceipt;
                        }
                        // We wait at least 1 seconds between tests
                        if (!extras.nowait) {
                            yield waiter(1000);
                        }
                        let error = null;
                        for (let attempt = 0; attempt < attempts; attempt++) {
                            try {
                                const result = yield Promise.race([
                                    test.execute(provider),
                                    waiter(timeout * 1000).then((result) => { throw new Error("timeout"); })
                                ]);
                                return result;
                            }
                            catch (attemptError) {
                                console.log(`*** Failed attempt ${attempt + 1}: ${attemptError.message}`);
                                error = attemptError;
                                // On failure, wait 5s
                                yield waiter(5000);
                            }
                        }
                        throw error;
                    });
                });
            });
        });
    });
});
describe.skip("Test WebSocketProvider", function () {
    this.retries(3);
    function testWebSocketProvider(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.destroy();
        });
    }
    it("InfuraProvider.getWebSocketProvider", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = quais.providers.InfuraProvider.getWebSocketProvider();
            yield testWebSocketProvider(provider);
        });
    });
});
//Poling diasabled as of Oct 24 2023
describe.skip("Test Events", function () {
    this.retries(3);
    function testBlockEvent(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let firstBlockNumber = null;
                const handler = (blockNumber) => {
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
            });
        });
    }
    it("InfuraProvider", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(60000);
            const provider = new quais.providers.InfuraProvider("goerli");
            yield testBlockEvent(provider);
        });
    });
});
//# sourceMappingURL=test-providers.js.map