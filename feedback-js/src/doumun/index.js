import * as sprite from './doumun-sprite'
import keyCodes from '../engine/keyboard'

const Animations = sprite.Animations

export default {
  manifest: sprite.Manifest,
  sprite: null,

  lastFrame: -1,
  currentFrame () { return Math.trunc(this.sprite.currentAnimationFrame) },

  movement: 0,
  isLeft: true,
  isRight: !this.isLeft,

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

  mustWalk () { return (this.pressingKeys[keyCodes.leftArrow] || this.pressingKeys[keyCodes.rightArrow]) && (this.isStanding()) },
  mustStand () { return (this.noKeys() && this.isWalking() && (this.atHighestFrame(5) || this.atHighestFrame(11))) },
  mustTurn () { return (((this.isLeft && this.pressingKeys[keyCodes.rightArrow]) || (this.isRight && this.pressingKeys[keyCodes.leftArrow])) && this.isStanding()) },

  betweenFrames (from, to) {
    console.log(`Current frame: ${Math.round(this.sprite.currentAnimationFrame)}`)
    return this.sprite.currentAnimationFrame >= from && this.sprite.currentAnimationFrame <= to
  },
  atHighestFrame (frame) { return this.betweenFrames(frame, frame + 0.2) },
  atLowestFrame (frame) { return this.betweenFrames(frame - 0.2, frame) },

  is (animation) { return this.sprite.currentAnimation === animation },
  isWalking () { return this.is(Animations.walking) },
  isStanding () { return this.is(Animations.standing) },

  play (animation, movement) {
    if (movement === 0) this.printPosition()
    // this.movement = movement
    this.movement = movement > 2 ? 4 : 2
    console.log(`Movement: ${this.movement}`)
    this.sprite.gotoAndPlay(animation)
    this.lastFrame = this.sprite.currentAnimationFrame
  },
  stand () { this.play(Animations.standing, 0) },
  walk () { this.play(Animations.walking, 64 / (12 * 5)) },
  turn () { this.play(Animations.turning, 0) },

  printPosition () {
    console.log(`Player X: ${this.sprite.x + this.sprite.getBounds().width / 2}`)
  },

  loaded (assets, stage) {
    const images = [assets.get(sprite.Manifest.id)]
    this.sprite = sprite.init(images, Animations.standing)

    // this.sprite.addEventListener('change', event => this.frameChanged(event))

    this.sprite.x = 32 - (this.sprite.getBounds().width / 2)
    this.sprite.y = 32 * 27 - this.sprite.getBounds().height
    this.printPosition()

    return this
  },
  ticked (playground) {
    if (this.isWalking() && (this.lastFrame !== this.sprite.currentAnimationFrame)) {
      this.lastFrame = this.sprite.currentAnimationFrame
      // this.frameChanged(playground)
      this.sprite.x += this.movement
    }

    if (this.mustWalk()) this.walk()
    if (this.mustStand()) this.stand()
    if (this.mustTurn()) this.turn()
  },
  keyUp (event) {
    this.pressingKeys[event.keyCode] = false
  },
  keyDown (event) {
    this.pressingKeys[event.keyCode] = true
  },
  frameChanged (event) {
    if (this.isWalking()) this.sprite.x += this.isLeft ? this.movement : (this.movement * -1)
  }
}
