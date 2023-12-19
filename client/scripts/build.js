'use strict'

import { rmSync } from 'node:fs'

import webpack from 'webpack'
import webpackConfig from './webpack.config.js'

const config = webpackConfig( 'production' )
const compiler = webpack( config )

rmSync( config.output.path, { recursive: true, force: true } )

compiler.run( ( err, stats ) => {
  if ( err ) {
    console.error( err.stack || err )
    if ( err.details ) {
      console.error( err.details )
    }
    return
  }
  const info = stats.toJson()
  if ( stats.hasErrors() ) {
    console.error( info.errors )
  }
  if ( stats.hasWarnings() ) {
    console.warn( info.warnings )
  }
} )
