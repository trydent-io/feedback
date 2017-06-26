import {Action, XAnimation, XSprite} from './doumun-sprite'
import {keys, LEFT_ARROW, RIGHT_ARROW, SHIFT, UP_ARROW, ENTER, SPACEBAR, N1, N2} from '../engine/keyboard'

export const BRADLEY_ID = 'conrad'

const STANDING = 'standing'
const WALKING = 'walking'
const TURNING = 'turning'
const JUMPING_FW = 'jumpingFW'

const ANIMATIONS = {
  [STANDING]: new XAnimation(0),
  [WALKING]: new XAnimation(1, 12, 0.300, WALKING),
  [TURNING]: new XAnimation(13, 22, 0.300, STANDING),
  [JUMPING_FW]: new XAnimation(23, 42, 0.300, STANDING)
}

ANIMATIONS[WALKING].movement = 32 / (11 * (1 / 0.300))
// ANIMATIONS[JUMPING_FW].movement = 16

const FRAMES = {
  x: 0,
  y: 0,
  width: 320,
  height: 200
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

    doneMidStepWalk: {get: () => this.isWalking && this.atMidFrame},
    doneLastStepWalk: {get: () => this.isWalking && this.frameIndex === 38},
    isReversalPressed: {get: () => ((keys[LEFT_ARROW] && this.isRight) || (keys[RIGHT_ARROW] && this.isLeft))},
    mustMidStand: {get: () => this.doneMidStepWalk && (this.isReversalPressed || keys.none)},
    mustLastStand: {get: () => this.doneLastStepWalk && (this.isReversalPressed || keys.none)},

    doneWalkStep: {get: () => this.isWalking && (this.atMidFrame || this.atLastFrame)},
    mustJumpFw: {get: () => keys[UP_ARROW] && keys[SHIFT] && this.isStanding},
    mustTurn: {get: () => this.isReversalPressed && this.isStanding},
    endedTurn: {get: () => this.isTurning && this.frameIndex === 23}
  })

  this.stand = () => this.play(STANDING)
  this.walk = () => this.play(WALKING)
  this.turn = () => this.play(TURNING)
  this.jumpFw = () => this.play(JUMPING_FW)

  this.ticked = playground => {
/*
    Action(this.changedTimedFrame, () => console.log(`
      Frame: ${this.timedFrame},
      Index: ${this.frameIndex},
      Anim: ${this.currentAnimation},
      Len: ${this.animation.length}
      `))
*/

    Action(this.mustWalk, this.walk)
    Action(this.mustMidStand, () => {
      this.stand()
      this.x += (64 * this.scaleX)
    })
    Action(this.doneLastStepWalk, () => {
      this.x += (128 * this.scaleX)
      Action(keys.none, this.stand)
    })
    Action(this.mustTurn, this.turn)

    Action(this.mustJumpFw, this.jumpFw)
    Action(this.isJumpingFw && (this.changedTimedFrame || this.frameIndex === 0), () => console.log(`Timed frame: ${this.timedFrame}, frame: ${this.frameIndex}`))
    Action(this.isJumpingFw && this.betweenFrames(7, 12), () => { this.x += (112 / (6 * (1 / this.animations[JUMPING_FW].mills))) * this.scaleX })
    Action(this.isJumpingFw && this.betweenFrames(7, 9), () => { this.y -= 4 })
    Action(this.isJumpingFw && this.betweenFrames(9, 11), () => { this.y += 4 })
    Action(this.isJumpingFw && this.frameIndex === 65, () => {
      this.stand()
      this.x += (128 + 16) * this.scaleX
    })

    Action(keys[ENTER], () => console.log(`Position: ${this.x}`))
    Action(keys[SPACEBAR], () => { this.x = 32 })
    Action(keys[N1], () => console.log(`Walking length: ${ANIMATIONS[WALKING].length}`))
    Action(keys[N2], () => console.log(`Jumping Fw length: ${ANIMATIONS[JUMPING_FW].length}`))

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
