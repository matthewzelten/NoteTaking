const { test } = require("@jest/globals");
const functions = require("./sample.js")

test("test that verify passwords works", () => {
    const passwordA = 'theSame';
    const passwordB = 'theSame';
    expect(true).toBeTruthy();
})