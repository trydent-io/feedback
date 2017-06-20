import * as sprite from './doumun-sprite'
import keyCodes from '../engine/keyboard'

const Animations = sprite.Animations

export default {
  manifest: sprite.Manifest,
  sprite: null,

  lastFrame: -1,
  currentFrame () { return this.sprite.currentAnimationFrame },

  movement: 0,
  isLeft () { return this.sprite.scaleX === -1 },
  isRight () { return !this.isLeft() },
  flip () { this.sprite.scaleX *= -1 },

  pressingKeys: {
    [keyCodes.leftArrow]: false,
    [keyCodes.rightArrow]: false,
    [keyCodes.upArrow]: false,
    [keyCodes.downArrow]: false,
    [keyCodes.spacebar]: false,
    [keyCodes.ctrl]: false,
    [keyCodes.shift]: false,
    [keyCodes.alt]: false
  },
  noKeys () {
    let none = true
    for (let key in this.pressingKeys) none &= !this.pressingKeys[key]
    return none
  },

  // *** STATES ***
  mustWalk () { return ((this.pressingKeys[keyCodes.leftArrow] && this.isLeft()) || (this.pressingKeys[keyCodes.rightArrow] && this.isRight())) && (this.isStanding()) },
  mustStand () { return (this.noKeys() && this.isWalking() && (this.atFrame(12 / 2) || this.atFrame(12))) },
  mustTurn () { return (((this.isLeft() && this.pressingKeys[keyCodes.rightArrow]) || (this.isRight() && this.pressingKeys[keyCodes.leftArrow])) && this.isStanding()) },

  betweenFrames (from, to) {
    return this.sprite.currentAnimationFrame >= from && this.sprite.currentAnimationFrame <= to
  },
  atFrame (frame) { return this.betweenFrames(frame - 0.100, frame + 0.100) },

  is (animation) { return this.sprite.currentAnimation === animation },
  isWalking () { return this.is(Animations.walking) },
  isStanding () { return this.is(Animations.standing) },
  isTurning () { return this.is(Animations.turning) },

  play (animation, movement) {
    if (movement === 0) this.printPosition()
    // this.movement = movement
    this.movement = Math.trunc(movement)
    // this.sprite.x += this.movement
    this.sprite.gotoAndPlay(animation)
    this.lastFrame = this.sprite.currentAnimationFrame
    // this.printPosition()
  },
  stand () { this.play(Animations.standing, 0) },
  walk () { this.play(Animations.walking, 128 / (12 * (1 / 0.200))) },
  turn () { this.play(Animations.turning, 0) },

  printPosition () {
    console.log(`Current frame: ${this.sprite.currentAnimationFrame}, position: ${this.sprite.x + this.sprite.getBounds().width / 2}`)
  },

  loaded (assets, stage) {
    const images = [assets.get(sprite.Manifest.id)]
    this.sprite = sprite.init(images, Animations.standing)

    this.sprite.regX = this.sprite.getBounds().width / 2
    this.sprite.regY = this.sprite.getBounds().height
    this.sprite.x = 32
    this.sprite.y = 32 * 27

    return this
  },
  ticked (playground) {
    if (this.isWalking() && (this.lastFrame !== this.sprite.currentAnimationFrame)) {
      this.lastFrame = this.sprite.currentAnimationFrame
      // this.frameChanged(playground)
      this.sprite.x += (this.movement * this.sprite.scaleX)
      // this.printPosition()
    }

    if (this.mustWalk()) this.walk()
    if (this.mustStand()) this.stand()
    if (this.mustTurn()) this.turn()
    if (this.isTurning() && this.atFrame(10)) {
      this.flip()
      if (this.pressingKeys[keyCodes.leftArrow] || this.pressingKeys[keyCodes.rightArrow]) {
        this.walk()
      } else if (this.noKeys()) {
        this.stand()
      }
    }

    if (this.pressingKeys[keyCodes.spacebar]) this.sprite.x = 32 - (this.sprite.getBounds().width / 2)
  },
  keyUp (event) {
    this.pressingKeys[event.keyCode] = false
  },
  keyDown (event) {
    this.pressingKeys[event.keyCode] = true
  }
}
