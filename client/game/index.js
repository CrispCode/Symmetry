/* globals window */

'use strict'

import template from './template.html'
import styles from './styles.inline.scss'

import { Component } from './../libs/component.js'

import { Stage } from './engine/stage.js'
import { Act } from './engine/act.js'

export class Game extends Component {
  static get template () {
    return template
  }
  static get styles () {
    return styles
  }

  #stage = null

  connectedCallback () {
    super.connectedCallback()

    this.#stage = new Stage( this.element )
    this.#stage.start()

    const act = new Act()
    act.load( '/acts/test.json' )
      .then( () => {
        this.#stage.play( act )
      } )
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.#stage.stop()
    this.#stage.destroy()
  }
}

window.customElements.define( 'component-game', Game )
