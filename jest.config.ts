import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  preset: "ts-jest",
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 89,
      functions: 90,
      lines: 90,
      statements: 0,
    },
  },
};

export default config;
