const { injectBabelPlugin } = require('react-app-rewired');
const rewireSVGR = require('react-app-rewire-svgr');

const path = require('path');

module.exports = {
  // // Add babel plugin(s)
  // config = injectBabelPlugin('transform-decorators-legacy', config);

  // // Add webpack svgr loader
  // config = rewireSVGR(config, env);

  // Add webpack aliases
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        src: path.resolve(__dirname, 'src'),
        components: path.resolve(__dirname, 'src/components'),
        layouts: path.resolve(__dirname, 'src/layouts'),
        screens: path.resolve(__dirname, 'src/screens'),
        modals: path.resolve(__dirname, 'src/modals'),
        assets: path.resolve(__dirname, 'src/assets'),
        utils: path.resolve(__dirname, 'src/utils')
      }
    };
    return config;
  }
};
