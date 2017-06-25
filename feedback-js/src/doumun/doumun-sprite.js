import createjs from 'createjs-easeljs'
import _ from 'underscore'

export const XAnimation = (from, to, mills, next) => ({
  from,
  to,
  next,
  mills,
  get length () {
    return (to + 1 - from) / mills
  },
  _movement: Math.trunc((to + 1 - from) > 1 ? 128 / ((to + 1 - from) * (1 / mills)) : 0),
  get movement () {
    return this._movement
  },
  set movement (value) {
    this._movement = value
  },
  get pattern () {
    return this.length > 1
      ? [this.from, this.to, this.next, this.mills]
      : {frames: [0]}
  }
})

export const asSettings = (animations) => {
  const p = {}
  for (let key in animations) {
    if (animations.hasOwnProperty(key)) {
      p[key] = animations[key].pattern
    }
  }
  return p
}

export function XSprite (image, regX, regY, frames, animations, start) {
  createjs.Sprite.call(this, new createjs.SpriteSheet({
    framerate: 30,
    images: [image],
    frames,
    animations: asSettings(animations)
  }), start)

  this.regX = regX
  this.regY = regY
  this.animations = animations
  this.lastFrame = -1
  this.frameIndex = 0

  this.update = () => {
    if (this.lastFrame !== this.timedFrame) {
      this.lastFrame = this.timedFrame
      this.frameIndex++
    }
    if (this.frameIndex === this.animation.length) this.frameIndex = 0
  }

  this.flip = () => { this.scaleX *= -1 }

  this.betweenTimedFrames = (from, to) => this.timedFrame >= from && this.timedFrame <= to
  this.betweenFrames = (from, to) => Math.trunc(this.timedFrame) >= from && Math.trunc(this.timedFrame) <= to
  this.atFrame = index => {
    // const time = this.animation.mills / 2
    return this.betweenTimedFrames(index - (this.animation.mills - 0.100), index + (this.animation.mills - 0.100))
  }

  this.move = () => { this.x += this.scaleX * this.movement }
  this.is = animation => this.currentAnimation === animation
  this.play = animation => {
    this.gotoAndPlay(animation)
    this.frameIndex = 0
  }

  Object.defineProperties(this, {
    isRight: {get: () => this.scaleX === 1},
    isLeft: {get: () => !this.isRight},

    width: {get: () => this.getBounds().width},
    height: {get: () => this.getBounds().height},

    animation: {get: () => this.animations[this.currentAnimation]},
    movement: {get: () => this.animation.movement},

    timedFrame: {get: () => this.currentAnimationFrame},
    changedTimedFrame: {get: () => this.lastFrame !== this.timedFrame},

    atMidFrame: {get: () => this.frameIndex === (this.animation.length / 2) - 1},
    atLastFrame: {get: () => this.frameIndex === this.animation.length - 1}
  })
}

XSprite.prototype = Object.create(createjs.Sprite.prototype)
XSprite.prototype.constructor = XSprite

export const Action = (condition, action) => (condition && _.isFunction(action)) && action()
