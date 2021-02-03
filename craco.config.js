const CracoLessPlugin = require('craco-less');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAntDesignPlugin = require('craco-antd');
const TerserPlugin = require('terser-webpack-plugin');
const { getThemeVariables } = require('antd/dist/theme');

const modifyVariables = getThemeVariables({
  dark: false,
});
modifyVariables['@primary-color'] = '#7d1ae5';
modifyVariables['@form-vertical-label-padding'] = '0 0 4px';

// Don't open the browser during development
// process.env.BROWSER = 'none';

module.exports = {
  webpack: {
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    plugins: [
      new WebpackBar({ profile: true }), ...(process.env.NODE_ENV === 'development' ? [new BundleAnalyzerPlugin({ openAnalyzer: false })] : [])
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: modifyVariables,
            javascriptEnabled: true,
          },
        },
      },
    },
    { plugin: CracoAntDesignPlugin },
  ],
};
