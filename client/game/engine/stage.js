/* globals window, requestAnimationFrame */

'use strict'

import {
  Clock,
  WebGLRenderer
} from 'three'

export class Stage {
  #element = null

  #renderer = null
  #act = null

  #clock = new Clock( false )

  #size = {
    width: 0,
    height: 0,
    isWatched: false
  }

  #onResize ( width, height ) {
    // Perform resize updates
    this.#renderer.setSize( width, height, false )
    if ( this.#act ) {
      this.#act.resize( this.#size.width, this.#size.height )
    }
  }

  constructor ( element ) {
    this.#element = element

    // Create renderer
    const renderer = new WebGLRenderer( { antialias: true, canvas: element } )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.shadowMap.enabled = true
    renderer.autoClear = false
    this.#renderer = renderer

    // Create resize watcher
    const watcherSize = () => {
      if ( !this.#size.isWatched ) {
        return
      }
      const element = this.#element
      if ( this.#size.width !== element.clientWidth || this.#size.height !== element.clientHeight ) {
        this.#size.width = element.clientWidth
        this.#size.height = element.clientHeight
        this.#onResize( this.#size.width, this.#size.height )
      }
      requestAnimationFrame( watcherSize )
    }
    this.#size.isWatched = true
    requestAnimationFrame( watcherSize )
  }

  destroy () {
    this.stop()
    this.#size.isWatched = false
  }

  start () {
    this.stop()
    this.#clock.start()
    this.#renderer.setAnimationLoop( () => {
      const delta = this.#clock.getDelta()

      if ( this.#act ) {
        this.#act.render( delta )
        this.#renderer.clear()
        this.#renderer.render( this.#act.scene, this.#act.camera )
      }
    } )
  }

  stop () {
    this.#renderer.setAnimationLoop( null )
    this.#clock.stop()
  }

  play ( act ) {
    act.resize( this.#size.width, this.#size.height )
    this.#act = act
  }
}
