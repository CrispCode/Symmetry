/* globals window */

'use strict'

import {
  Vector2
} from 'three'

export class Controls {
  #pointer = new Vector2()

  #keybinds = {}
  #keys = {}
  #pressed = {}

  #size = {
    width: 0,
    height: 0
  }

  constructor () {
    window.addEventListener( 'pointermove', ( ev ) => {
      this.#pointer.x = ( ev.clientX / this.#size.width ) * 2 - 1
      this.#pointer.y = -( ev.clientY / this.#size.height ) * 2 + 1
    }, true )

    window.addEventListener( 'mousedown', ( ev ) => {
      if ( ev.repeat ) {
        return
      }
      for ( let action in this.#keys ) {
        if ( this.#keybinds[ action ]?.type === 'mouse' && ev.button === this.#keybinds[ action ].key ) {
          this.#pressed[ action ] = this.#keys[ action ]
        }
      }
    }, true )
    window.addEventListener( 'mouseup', ( ev ) => {
      for ( let action in this.#keys ) {
        if ( this.#keybinds[ action ]?.type === 'mouse' && ev.button === this.#keybinds[ action ].key ) {
          delete this.#pressed[ action ]
        }
      }
    }, true )
    window.addEventListener( 'contextmenu', ( ev ) => {
      ev.preventDefault()
      return false
    }, true )

    window.addEventListener( 'keydown', ( ev ) => {
      if ( ev.repeat ) {
        return
      }
      for ( let action in this.#keys ) {
        if ( this.#keybinds[ action ]?.type === 'keyboard' && ev.key === this.#keybinds[ action ].key ) {
          this.#pressed[ action ] = this.#keys[ action ]
        }
      }
    }, true )
    window.addEventListener( 'keyup', ( ev ) => {
      for ( let action in this.#keys ) {
        if ( this.#keybinds[ action ]?.type === 'keyboard' && ev.key === this.#keybinds[ action ].key ) {
          delete this.#pressed[ action ]
        }
      }
    }, true )
  }

  resize ( width, height ) {
    this.#size.width = width
    this.#size.height = height
  }

  load ( keybinds ) {
    this.#keybinds = keybinds
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
      this.#pressed[ action ]( delta, this.#pointer )
    }
  }
}
