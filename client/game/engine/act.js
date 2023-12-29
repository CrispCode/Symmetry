'use strict'

import { Request } from './../../libs/request.js'

import { World } from './world.js'
import { Controls } from './controls.js'

import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  Color,
  AxesHelper
} from 'three'

import * as BLOCKS from './blocks/index.js'

const scale = 1
const speed = 10

export class Act {
  #camera = null
  get camera () {
    return this.#camera
  }

  #scene = null
  get scene () {
    return this.#scene
  }

  constructor () {
    this.#camera = new PerspectiveCamera( 75, 1, 1, 1000 )
    this.#scene = new Scene()

    this.#scene.add( new AxesHelper( 1000 ) )
  }

  #world = null
  #controls = null

  load ( url ) {
    return Request.get( url )
      .then( ( map ) => {
        // Create light
        const light = new AmbientLight( new Color( map.ambient_light ) )
        this.#scene.add( light )

        // Update camera
        this.#camera.position.set( map.camera_position.x * scale, map.camera_position.y * scale, map.camera_position.z * scale )
        this.#camera.rotateX( Math.PI / -2 )

        // Create blocks
        const world = new World( map.chunk_size )
        world.scale.set( scale, scale, scale )
        this.#world = world
        this.#scene.add( this.#world )

        map.blocks.forEach( ( data ) => {
          const block = new BLOCKS[ data.type ]()
          block.x = data.x
          block.y = data.y
          block.z = data.z
          this.#world.addBlock( block )
        } )
      } )
      .then( () => {
        return Request.get( '/keybinds.json' )
          .then( ( keybinds ) => {
            const controls = new Controls( keybinds )
            controls.on( 'MOVE_FORWARD', ( delta ) => {
              this.#camera.position.z -= delta * scale * speed
            } )
            controls.on( 'MOVE_BACKWARD', ( delta ) => {
              this.#camera.position.z += delta * scale * speed
            } )
            controls.on( 'MOVE_LEFT', ( delta ) => {
              this.#camera.position.x -= delta * scale * speed
            } )
            controls.on( 'MOVE_RIGHT', ( delta ) => {
              this.#camera.position.x += delta * scale * speed
            } )
            this.#controls = controls
          } )
      } )
  }

  render ( delta ) {
    this.#world.loadChunks( Math.floor( this.#camera.position.x / scale ), 0, Math.floor( this.#camera.position.z / scale ), 1 )
    this.#controls.update( delta )
  }
}
