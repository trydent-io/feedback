import {Action, XAnimation, XSprite} from './doumun-sprite'
import {keys, LEFT_ARROW, RIGHT_ARROW, SHIFT, UP_ARROW, ENTER} from '../engine/keyboard'

export const BRADLEY_ID = 'conrad'

const STANDING = 'standing'
const WALKING = 'walking'
const TURNING = 'turning'
const JUMPING_FW = 'jumpingFW'

const ANIMATIONS = {
  [STANDING]: new XAnimation(0),
  [WALKING]: new XAnimation(1, 12, 0.400, WALKING),
  [TURNING]: new XAnimation(13, 22, 0.400),
  [JUMPING_FW]: new XAnimation(23, 42, 0.400, STANDING)
}

ANIMATIONS[JUMPING_FW].movement = 6

const FRAMES = {
  x: 0,
  y: 0,
  width: 320,
  height: 156
}

export function Bradley (image) {
  XSprite.call(this, image, 160, FRAMES.height, FRAMES, ANIMATIONS, STANDING)

  Object.defineProperties(this, {
    id: {get: () => BRADLEY_ID},
    isStanding: {get: () => this.is(STANDING)},
    isWalking: {get: () => this.is(WALKING)},
    isTurning: {get: () => this.is(TURNING)},
    isJumpingFw: {get: () => this.is(JUMPING_FW)},

    mustWalk: {get: () => ((keys[RIGHT_ARROW] && this.isRight) || (keys[LEFT_ARROW] && this.isLeft)) && this.isStanding},
    doneWalkStep: {get: () => this.isWalking && (this.atMidFrame || this.atLastFrame)},
    mustStand: {get: () => (keys.none && this.doneWalkStep)},
    mustJumpFw: {get: () => keys[UP_ARROW] && keys[SHIFT] && this.isStanding},
    mustTurn: {get: () => ((keys[RIGHT_ARROW] && this.isLeft) || (keys[LEFT_ARROW] && this.isRight)) && (this.isStanding || this.doneWalkStep)},
    endedTurn: {get: () => this.isTurning && this.frameIndex === 23}
  })

  this.stand = () => this.play(STANDING)
  this.walk = () => this.play(WALKING)
  this.turn = () => {
    this.play(TURNING)
  }

  this.ticked = playground => {
/*
    Action(this.changedTimedFrame, () => console.log(`
      Frame: ${this.timedFrame},
      Index: ${this.frameIndex},
      Anim: ${this.currentAnimation},
      Len: ${this.animation.length}
      `))
*/
    Action(this.isWalking && this.changedTimedFrame, this.move)

    Action(this.mustWalk, this.walk)
    Action(this.mustStand, this.stand)
    Action(this.mustTurn, this.turn)

    Action(this.mustJumpFw, () => this.play(JUMPING_FW))
    Action(this.isJumpingFw && this.betweenFrames(7, 12), this.move)
    Action(this.isJumpingFw && this.betweenFrames(7, 9), () => { this.y -= 4 })
    Action(this.isJumpingFw && this.betweenFrames(9, 11), () => { this.y += 4 })
    Action(this.isJumpingFw && this.atLastFrame, () => { this.x += (4 * 32) * this.scaleX })

    Action(keys[ENTER], () => console.log(`Position: ${this.x}`))

    Action(this.endedTurn, () => {
      this.flip()
      this.stand()
    })
    // if (this.mustWalk()) this.walk()
    // Action(this.mustStand, this.stand)
    // Action(this.mustTurn, this.turn)
    this.update()
  }
}

Bradley.prototype = Object.create(XSprite.prototype)
Bradley.prototype.constructor = Bradley
