'use strict'

import {
  BoxGeometry,
  MeshStandardMaterial
} from 'three'

export class Block {
  static get type () {
    return this.name
  }

  static get geometry () {
    const geometry = new BoxGeometry( 1, 1, 1 )
    geometry.translate( 0.5, 0.5, 0.5 )
    return geometry
  }

  static get material () {
    return new MeshStandardMaterial( { color: 0xCCCCCC } )
  }

  x = 0
  y = 0
  z = 0

  rotation = null
}
