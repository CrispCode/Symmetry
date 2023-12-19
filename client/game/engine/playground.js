/* globals window */

'use strict'

import {
  AmbientLight,
  Clock,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class Playground {
  #element = null
  get element () {
    return this.#element
  }

  #renderer = null
  #scene = null
  #camera = null
  get camera () {
    return this.#camera
  }

  #controls = null

  #clock = new Clock( false )

  #onRender = null

  #size = {
    width: 0,
    height: 0,
    isWatched: false
  }

  #onResize ( width, height ) {
    // Perform resize updates
    this.#renderer.setSize( width, height, false )
    this.#camera.aspect = width / height
    this.#camera.updateProjectionMatrix()
    this.#controls.update()
  }

  constructor ( element ) {
    this.#element = element

    // Create renderer
    const renderer = new WebGLRenderer( { antialias: true, canvas: element } )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.shadowMap.enabled = true
    renderer.autoClear = false
    this.#renderer = renderer

    // Create camera
    const camera = new PerspectiveCamera( 75, 1, 1, 10000 )
    camera.position.set( 10, 10, 100 )
    this.#camera = camera

    // Create controls
    const controls = new OrbitControls( this.#camera, this.#element )
    this.#controls = controls

    // Create scene
    const scene = new Scene()
    scene.background = new Color( 0xEEEEEE )
    this.#scene = scene

    // Create light
    const light = new AmbientLight( 0xFFFFFF )
    this.#scene.add( light )

    // Create resize watcher
    const watcherSize = () => {
      setTimeout( () => {
        if ( this.#size.isWatched ) {
          const element = this.#element
          if ( this.#size.width !== element.clientWidth || this.#size.height !== element.clientHeight ) {
            this.#size.width = element.clientWidth
            this.#size.height = element.clientHeight
            this.#onResize( this.#size.width, this.#size.height )
          }
          watcherSize()
        }
      }, 100 )
    }
    this.#size.isWatched = true
    watcherSize()
  }

  start () {
    this.stop()
    this.#clock.start()
    this.#renderer.setAnimationLoop( () => {
      const delta = this.#clock.getDelta()

      if ( typeof this.#onRender === 'function' ) {
        this.#onRender( delta )
      }

      this.#renderer.clear()
      this.#controls.update()
      this.#renderer.render( this.#scene, this.#camera )
    } )
  }

  stop () {
    this.#renderer.setAnimationLoop( null )
    this.#clock.stop()
  }

  onRender ( callback ) {
    this.#onRender = callback
  }

  add ( object ) {
    this.#scene.add( object )
  }
  remove ( object ) {
    this.#scene.remove( object )
  }
}
