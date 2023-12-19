/* globals window, document */

'use strict'

import template from './template.html'
import styles from './styles.inline.scss'

import { html } from './../utils/index.js'

class Frame {
  static #element = null
  static #parent = null

  static loadScript ( url, element ) {
    return new Promise( ( resolve, reject ) => {
      const script = document.createElement( 'script' )
      script.addEventListener( 'load', resolve )
      script.addEventListener( 'error', reject )
      script.src = url
      element.append( script )
    } )
  }

  static loadComponent ( name, url, element ) {
    return this.loadScript( url, element )
      .then( () => {
        const component = html( '<component-' + name + '></component-' + name + '>' )
        element.append( component )
      } )
  }

  static showLoadingScreen () {
    this.#element.querySelector( '.loader' ).classList.remove( 'hide' )
    return Promise.resolve()
  }
  static hideLoadingScreen () {
    this.#element.querySelector( '.loader' ).classList.add( 'hide' )
    return Promise.resolve()
  }

  static init ( parent ) {
    this.#parent = parent
    this.#element = html( template )

    this.#parent.append( html( '<style>' + styles + '</style>' ) )
    this.#parent.append( this.#element )
  }

  static load () {
    return this.loadComponent( 'game', 'game.js', this.#element.querySelector( '.container' ) )
  }
}

// Bootstrap
window.addEventListener( 'DOMContentLoaded', () => {
  Frame.init( document.body )
  Frame.showLoadingScreen()
    .then( () => {
      return Frame.load()
    } )
    .then( () => {
      return Frame.hideLoadingScreen()
    } )
    .catch( ( err ) => {
      console.error( err )
    } )
} )

