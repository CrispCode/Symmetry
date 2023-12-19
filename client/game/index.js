/* globals window */

'use strict'

import template from './template.html'
import styles from './styles.inline.scss'

import { Component } from './../libs/component.js'

export class Game extends Component {
  static get template () {
    return template
  }
  static get styles () {
    return styles
  }

  connectedCallback () {
    super.connectedCallback()
  }
}

window.customElements.define( 'component-game', Game )
