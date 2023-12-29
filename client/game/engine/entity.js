'use strict'

import {
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  Group,
  Vector3,

  ArrowHelper
} from 'three'

export class Entity extends Group {
  static get type () {
    return this.name
  }

  static get geometry () {
    const geometry = new BoxGeometry( 1, 1, 1 )
    geometry.translate( 0, 0.5, 0 )
    return geometry
  }

  static get material () {
    return new MeshStandardMaterial( { color: 0xCCCCCC } )
  }

  constructor () {
    super()

    this.add( new Mesh( this.constructor.geometry, this.constructor.material ) )

    this.add( new ArrowHelper( new Vector3( 0, 0, -1 ), new Vector3( 0, 0, 0 ), 1, 0xFFFF00 ) )
  }
}
