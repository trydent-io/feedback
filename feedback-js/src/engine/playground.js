import createjs from 'createjs-easeljs'
import 'createjs-preloadjs'

const assets = new createjs.LoadQueue(false)

export default {
  assets: assets,
  playground: null,
  loading: true,
  manifest: [],
  stages: [],
  debug: {},

  get (id) {
    return this.assets.getResult(id)
  },

  loaded () {
    this.playground = new createjs.Stage('playground')

    this.stages
      .filter(s => s.loaded !== undefined)
      .forEach(s => s.loaded(this, this.playground))

    createjs.Ticker.timingMode = createjs.Ticker.RAF
    createjs.Ticker.addEventListener('tick', () => this.ticked())
    this.loading = false
  },

  ticked () {
    this.stages
      .filter(s => s.ticked !== undefined)
      .forEach(s => s.ticked(this))

    this.playground.update()
  },

  keyDown (event) {
    for (let s of this.stages) {
      if (s.keyDown !== undefined) {
        s.keyDown(event, this.playground)
      }
    }
  },
  keyUp (event) {
    this.stages
      .filter(s => s.keyUp !== undefined)
      .forEach(s => s.keyUp(event, this.playground))
  },

  load () {
    this.stages
      .filter(s => s.beforeLoad !== undefined)
      .forEach(s => s.beforeLoad(this))

    this.assets.addEventListener('complete', () => this.loaded())
    this.assets.loadManifest(this.manifest, true, '/static/')

    document.onkeydown = event => this.keyDown(event)
    document.onkeyup = event => this.keyUp(event)
  }
}
