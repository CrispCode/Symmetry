'use strict'

import {
  MeshStandardMaterial
} from 'three'

import { Entity } from './../engine/entity.js'

export class EntityDefault extends Entity {
  static get material () {
    return new MeshStandardMaterial( { color: 0xFF0000 } )
  }
}
