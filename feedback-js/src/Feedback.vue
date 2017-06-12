<template>
  <div id="feedback" class="ui segment">
    <div class="ui dimmer" :class="{ active: loading }">
      <div class="ui huge text loader">Loading</div>
    </div>
    <canvas id="playground" ref="playground" width="1024" height="896"></canvas>
  </div>
</template>

<script>
  import createjs from 'createjs-easeljs'
  import 'createjs-preloadjs'
  import 'semantic-ui-css/semantic.min.css'

  export default {
    mounted () {
      this.loader = new createjs.LoadQueue(false)
      this.loader.addEventListener('complete', this.onComplete)
      this.loader.loadManifest(this.manifest, true, '/static/')
    },
    data: () => ({
      loading: true,
      playground: null,
      loader: null,
      background: null,
      entranceFront: null,
      receptionist: null,
      officialEntrance: null,
      bradley: null,
      tree: null,
      manifest: [{
        src: 'background.png',
        id: 'background'
      }, {
        src: 'entrance_front.png',
        id: 'entrance_front'
      }, {
        src: 'receptionist.png',
        id: 'receptionist'
      }, {
        src: 'official_entrance.png',
        id: 'officialEntrance'
      }, {
        src: 'conrad_walking.png',
        id: 'conradWalking'
      }, {
        src: 'conrad_standing.png',
        id: 'conradStanding'
      }, {
        src: 'tree.png',
        id: 'tree'
      }]
    }),
    computed: {
      height () { return this.playground.canvas.height },
      width () { return this.playground.canvas.width }
    },
    methods: {
      asX (rectX) { return (rectX - 1) * 32 },
      asY (rectY) { return (rectY - 1) * 32 },
      onComplete () {
        this.loading = false
        this.playground = new createjs.Stage('playground')

        this.background = new createjs.Shape()
        this.background.graphics.beginBitmapFill(this.loader.getResult('background')).drawRect(0, 0, this.width, this.height)

        this.entranceFront = new createjs.Bitmap(this.loader.getResult('entrance_front'))
        this.entranceFront.x = 288 - this.entranceFront.image.width
        this.entranceFront.y = 32 * 27 - this.entranceFront.image.height

        this.receptionist = new createjs.Bitmap(this.loader.getResult('receptionist'))
        this.receptionist.x = 640 - this.receptionist.image.width
        this.receptionist.y = 32 * 27 - this.receptionist.image.height

        this.officialEntrance = new createjs.Bitmap(this.loader.getResult('officialEntrance'))
        this.officialEntrance.x = 1024 - this.officialEntrance.image.width
        this.officialEntrance.y = 32 * 27 - this.officialEntrance.image.height

        this.tree = new createjs.Bitmap(this.loader.getResult('tree'))
        this.tree.x = 974 - this.tree.image.width
        this.tree.y = 32 * 27 - this.tree.image.height

        let frames = [[0, 0, 28, 156, 0]]
        for (let i = 0; i < 12; i++) frames.push([(i * 88), 0, 88, 156, 1])
        console.table(frames)

        const bradleySheet = new createjs.SpriteSheet({
          framerate: 20,
          images: [this.loader.getResult('conradStanding'), this.loader.getResult('conradWalking')],
          frames: frames,
          animations: {
            standing: {frames: [0]},
            walking: [1, 12, 'walking', 0.200]
          }
        })

        this.bradley = new createjs.Sprite(bradleySheet, 'walking')
        this.bradley.x = 64
        this.bradley.y = 32 * 27 - 156

        this.playground.addChild(
          this.background,
          this.receptionist,
          this.tree,
          this.bradley,
          this.entranceFront,
          this.officialEntrance
        )

        createjs.Ticker.timingMode = createjs.Ticker.RAF
        createjs.Ticker.addEventListener('tick', this.tick)
      },
      tick (event) {
        let deltaS = event.delta / 1000
        let position = this.bradley.x + 122 * deltaS
//        console.log(`Current position: ${position}`)
//        let position = this.bradley.x + 2

        let bradleyWidth = this.bradley.getBounds().width * this.bradley.scaleX
        this.bradley.x = (position >= this.width + bradleyWidth) ? -bradleyWidth : position

        this.playground.update()
      }
    }
  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    background-color: #434A54 !important;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  div#feedback {
    width: 1024px;
    height: 896px;
    margin: auto 0;
    padding: 0;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #E6E9ED;
    display: flex;
    border: 0;
    border-radius: 12px;
  }

  canvas#playground {
    border-radius: 12px;
  }
</style>
