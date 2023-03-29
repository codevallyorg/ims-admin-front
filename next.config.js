/** @type {import('next').NextConfig} */

const withAntdLess = require('next-plugin-antd-less');

const nextConfig = {
  reactStrictMode: true,
};

const antdConfig = withAntdLess({
  lessVarsFilePath: './src/styles/variables.less',

  webpack(config) {
    return config;
  },
});

module.exports = {
  ...nextConfig,
  ...antdConfig,
};
