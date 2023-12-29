'use strict'

import { Block } from './../block.js'

import {
  MeshStandardMaterial
} from 'three'

export class BlockGrass extends Block {
  static get material () {
    return new MeshStandardMaterial( { color: 0x00CC00 } )
  }
}
