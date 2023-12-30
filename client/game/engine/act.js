'use strict'

import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  Color,
  AxesHelper,
  Vector3,
  Raycaster,
  Matrix4
} from 'three'

import { Request } from './../../libs/request.js'

import { World } from './world.js'
import { Controls } from './controls.js'

import * as BLOCKS from './../blocks/index.js'
import * as ENTITIES from './../entities/index.js'

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

  #controls = null
  get controls () {
    return this.#controls
  }

  resize ( width, height ) {
    this.#camera.aspect = width / height
    this.#camera.updateProjectionMatrix()
    this.#controls.resize( width, height )
  }

  constructor () {
    this.#camera = new PerspectiveCamera( 75, 1, 1, 1000 )
    this.#controls = new Controls( 0, 0 )
    this.#scene = new Scene()

    this.#scene.add( new AxesHelper( 1000 ) )
  }

  #world = null
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
            this.#controls.load( keybinds )

            this.#controls.on( 'SELECT', ( delta, pointer ) => {
              const raycaster = new Raycaster()
              raycaster.setFromCamera( pointer, this.#camera )
              const intersects = raycaster.intersectObject( this.#scene, true )
              for ( let i = 0; i < intersects.length; i++ ) {
                // intersects[ 0 ].object.material.color.set( 0xff0000 )
                console.log( intersects[ 0 ].object, intersects[ 0 ].instanceId )
              }
            } )

            this.#controls.on( 'MOVE', ( delta, pointer ) => {
              const raycaster = new Raycaster()
              raycaster.setFromCamera( pointer, this.#camera )
              // We only raycast through blocks
              const intersects = raycaster.intersectObject( this.#world, true )
              if ( intersects.length > 0 ) {
                const matrix = new Matrix4()
                intersects[ 0 ].object.getMatrixAt( intersects[ 0 ].instanceId, matrix )
                const destination = new Vector3()
                destination.setFromMatrixPosition( matrix )
                // TODO: this is an instant teleport. We need to move the movement in entity and perform it every render
                this.#player.position.x = destination.x
                this.#player.position.z = destination.z
                console.log( destination, intersects[ 0 ].parent.position )
              }
            } )

            this.#controls.on( 'MOVE_FORWARD', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).multiplyScalar( delta * scale * speed ) )
            } )
            this.#controls.on( 'MOVE_BACKWARD', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).negate().multiplyScalar( delta * scale * ( speed / 2 ) ) )
            } )
            this.#controls.on( 'MOVE_LEFT', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).applyAxisAngle( new Vector3( 0, 1, 0 ), Math.PI / 2 ).multiplyScalar( delta * scale * speed * ( 3 / 4 ) ) )
            } )
            this.#controls.on( 'MOVE_RIGHT', ( delta ) => {
              this.#player.position.add( new Vector3( 0, 0, -1 ).applyQuaternion( this.#player.quaternion ).applyAxisAngle( new Vector3( 0, 1, 0 ), -Math.PI / 2 ).multiplyScalar( delta * scale * speed * ( 3 / 4 ) ) )
            } )
            this.#controls.on( 'TURN_LEFT', ( delta ) => {
              this.#player.rotateY( delta * speed / 2 )
            } )
            this.#controls.on( 'TURN_RIGHT', ( delta ) => {
              this.#player.rotateY( -delta * speed / 2 )
            } )
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
