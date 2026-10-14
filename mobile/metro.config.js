/*
 * Cho phép import fixtures demo dùng chung từ ../src/demo (pure TS,
 * không dependency) — một nguồn dữ liệu giả lập cho cả web và mobile.
 */
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, "..")];

module.exports = config;
