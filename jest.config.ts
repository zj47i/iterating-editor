import type { Config } from "jest";

const config: Config = {
    verbose: true,
    testEnvironment: "jsdom",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    testPathIgnorePatterns: [".*\\.mock.*\\.(ts|tsx)$"],
    coveragePathIgnorePatterns: [".*\\.mock.*\\.(ts|tsx)$"],
};

export default config;
