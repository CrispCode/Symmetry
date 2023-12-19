/* globals HTMLElement */

'use strict'

import { html } from './../utils/index.js'

export class Component extends HTMLElement {
  static observedAttributes = []

  static get template () {
    return null
  }
  static get styles () {
    return null
  }

  #css = null
  get css () {
    return this.#css
  }

  #element = null
  get element () {
    return this.#element
  }

  #shadow = null

  constructor () {
    super()

    this.#shadow = this.attachShadow( { mode: 'closed' } )
  }

  connectedCallback () {
    if ( this.constructor.styles ) {
      this.#css = html( '<style>' + this.constructor.styles + '</style>' )
      this.#shadow.append( this.#css )
    }
    if ( this.constructor.template ) {
      this.#element = html( this.constructor.template )
      this.#shadow.append( this.#element )
    }
  }

  disconnectedCallback () {
    this.#shadow.innerHTML = ''
  }

  adoptedCallback () {}

  attributeChangedCallback ( name, oldValue, newValue ) {} // eslint-disable-line no-unused-vars
}
