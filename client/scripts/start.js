'use strict'

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './webpack.config.js'

const config = webpackConfig( 'development' )
const compiler = webpack( config )

// Development server
const devServer = {
  open: true,
  static: {
    publicPath: '/',
    directory: config.output.path
  },
  hot: false,
  liveReload: true,
  historyApiFallback: true,
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  setupMiddlewares: ( middlewares ) => {
    return middlewares
  }
}

const server = new WebpackDevServer( devServer, compiler )
server.start( 8080, 'localhost', ( err ) => {
  if ( err ) {
    console.error( err )
  }
} )
