import createjs from 'createjs-easeljs'

export const Manifest = {
  id: 'conrad',
  src: 'conrad.png'
}

export const Animations = {
  standing: 'standing',
  walking: 'walking',
  turning: 'turning'
}

const spriteSheet = (images) => {
  return new createjs.SpriteSheet({
    framerate: 30,
    images: images,
    frames: {
      x: 0,
      y: 0,
      width: 88,
      height: 156
    },
    animations: {
      [Animations.standing]: { frames: [0] },
      [Animations.walking]: [1, 12, Animations.walking, 0.200]
    }
  })
}

export const init = (images, animation) => new createjs.Sprite(spriteSheet(images), animation)
