import { open } from 'node:fs/promises'

const chunkSize = 10

const content = {
  'ambient_light': 'rgb(255,255,255)',
  'chunk_size': chunkSize,
  'camera_position': {
    x: 0,
    y: 50,
    z: 0
  },
  'blocks': []
}

const halfWidth = 2
const halfHeight = 0
const halfDepth = 2

for ( let x = -halfWidth; x <= halfWidth; x++ ) {
  for ( let y = -halfHeight; y <= halfHeight; y++ ) {
    for ( let z = -halfDepth; z <= halfDepth; z++ ) {
      // Generate chunk
      for ( let i = 0; i < chunkSize; i++ ) {
        for ( let j = 0; j < chunkSize; j++ ) {
          for ( let k = 0; k < chunkSize; k++ ) {
            let type = ( Math.random() < 0.5 ) ? 'BlockGrass' : 'BlockDirt'
            if (
              ( i === 0 && j === 0 && k === 0 ) ||
              ( i === chunkSize - 1 && j === 0 && k === 0 ) ||
              ( i === 0 && j === 0 && k === chunkSize - 1 ) ||
              ( i === chunkSize - 1 && j === 0 && k === chunkSize - 1 ) ||

              ( i === 0 && j === chunkSize - 1 && k === 0 ) ||
              ( i === chunkSize - 1 && j === chunkSize - 1 && k === 0 ) ||
              ( i === 0 && j === chunkSize - 1 && k === chunkSize - 1 ) ||
              ( i === chunkSize - 1 && j === chunkSize - 1 && k === chunkSize - 1 )
            ) {
              type = 'BlockDefault'
            }
            content.blocks.push( {
              'type': type,
              'x': ( x * chunkSize ) + i,
              'y': ( y * chunkSize ) + j,
              'z': ( z * chunkSize ) + k
            } )
          }
        }
      }
    }
  }
}

const file = await open( './client/assets/acts/test.json', 'w+' )
await file.write( JSON.stringify( content ), 0 )
await file.close()
