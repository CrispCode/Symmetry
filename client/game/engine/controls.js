/* globals document */

'use strict'

export class Controls {
  #keybinds = {}
  #keys = {}
  #pressed = {}

  constructor ( keybinds ) {
    this.#keybinds = keybinds

    document.addEventListener( 'keydown', ( ev ) => {
      for ( let action in this.#keys ) {
        if ( ev.key === this.#keybinds[ action ] ) {
          this.#pressed[ action ] = this.#keys[ action ]
        }
      }
    }, true )
    document.addEventListener( 'keyup', ( ev ) => {
      for ( let action in this.#keys ) {
        if ( ev.key === this.#keybinds[ action ] ) {
          delete this.#pressed[ action ]
        }
      }
    }, true )
  }

  on ( action, execute ) {
    // If something is bound to that key, unbind it first
    if ( this.#keys[ action ] ) {
      this.off( action )
    }
    this.#keys[ action ] = execute
  }

  off ( action ) {
    delete this.#keys[ action ]
    delete this.#pressed[ action ]
  }

  unbind () {
    this.#keys = {}
    this.#pressed = {}
  }

  update ( delta ) {
    for ( let action in this.#pressed ) {
      this.#pressed[ action ]( delta )
    }
  }
}
