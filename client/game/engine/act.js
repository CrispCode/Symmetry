'use strict'

import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  Color,
  AxesHelper,
  Vector3
} from 'three'

import { Request } from './../../libs/request.js'

import { World } from './world.js'
import { Controls } from './controls.js'

import * as BLOCKS from './blocks/index.js'
import * as ENTITIES from './entities/index.js'

const scale = 1
const speed = 5

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
  #player = null

  load ( url ) {
    return Request.get( url )
      .then( ( map ) => {
        // Create light
        const light = new AmbientLight( new Color( map.ambient_light ) )
        this.#scene.add( light )

        return map
      } )
      .then( ( map ) => {
        // Create world
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

        return map
      } )
      .then( ( map ) => {
        // Create player
        const player = new ENTITIES[ 'EntityDefault' ]()
        player.position.set( map.player_position.x * scale, map.player_position.y * scale, map.player_position.z * scale )
        this.#player = player
        this.#scene.add( player )
      } )
      .then( () => {
        return Request.get( '/keybinds.json' )
          .then( ( keybinds ) => {
            const controls = new Controls( keybinds )
            controls.on( 'MOVE_FORWARD', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).multiplyScalar( delta * scale * speed ) )
            } )
            controls.on( 'MOVE_BACKWARD', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).negate().multiplyScalar( delta * scale * ( speed / 2 ) ) )
            } )
            controls.on( 'MOVE_LEFT', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).applyAxisAngle( new Vector3( 0, 1, 0 ), Math.PI / 2 ).multiplyScalar( delta * scale * speed * ( 3 / 4 ) ) )
            } )
            controls.on( 'MOVE_RIGHT', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).applyAxisAngle( new Vector3( 0, 1, 0 ), -Math.PI / 2 ).multiplyScalar( delta * scale * speed * ( 3 / 4 ) ) )
            } )
            controls.on( 'TURN_LEFT', ( delta ) => {
              this.#player.rotateY( delta * speed / 2 )
            } )
            controls.on( 'TURN_RIGHT', ( delta ) => {
              this.#player.rotateY( -delta * speed / 2 )
            } )
            this.#controls = controls
          } )
      } )
  }

  render ( delta ) {
    this.#world.loadChunks( Math.floor( this.#player.position.x / scale ), 0, Math.floor( this.#player.position.z / scale ), 1 )
    this.#controls.update( delta )

    // Top Down
    this.#camera.position.copy( this.#player.position )
    this.#camera.position.y += 20
    this.#camera.position.z += 5
    this.#camera.lookAt( this.#player.position.x, this.#player.position.y, this.#player.position.z )
  }
}
