'use strict'

import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import CopyWebpackPlugin from 'copy-webpack-plugin'

const config = ( mode ) => {
  const isProduction = ( mode === 'production' )

  const __dirname = dirname( fileURLToPath( import.meta.url ) )

  const src = resolve( __dirname, '../' )
  const dest = resolve( __dirname, '../../dist' )
  const assets = resolve( __dirname, '../assets' )
  const html = resolve( __dirname, '../index.html' )

  const config = {
    mode: mode,
    cache: !isProduction,

    stats: 'summary',

    entry: {
      'frame': resolve( src, 'frame/index.js' ),
      'game': resolve( src, 'game/index.js' )
    },
    output: {
      path: dest,
      filename: '[name].js',
      pathinfo: !isProduction,
      clean: true
    },
    resolve: {
      symlinks: false
    },
    performance: {
      hints: ( isProduction ) ? 'warning' : false
    },
    optimization: {
      nodeEnv: mode,
      flagIncludedChunks: true,
      sideEffects: true,
      usedExports: true,
      concatenateModules: true,
      emitOnErrors: !isProduction,
      checkWasmTypes: true,
      minimize: isProduction
    },
    plugins: [
      new CopyWebpackPlugin( {
        patterns: [
          {
            from: assets,
            to: dest,
            noErrorOnMissing: true
          },
          {
            from: html,
            to: dest,
            noErrorOnMissing: true
          }
        ]
      } )
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                compact: false,
                presets: [
                  [ '@babel/preset-env', {
                    modules: false,
                    include: [ 'proposal-object-rest-spread' ]
                  } ]
                ]
              }
            }
          ]
        },
        {
          test: /\.inline\.scss$/,
          use: [
            {
              loader: 'raw-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /^((?!\.inline).)*\.scss$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                modules: {
                  mode: 'icss'
                }
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(html)$/i,
          loader: 'raw-loader',
          options: {
            esModule: false
          }
        }
      ]
    }
  }

  if ( !isProduction ) {
    config.devtool = 'source-map'
  }

  return config
}

export default config
