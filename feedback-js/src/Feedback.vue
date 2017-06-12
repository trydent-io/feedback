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
      manifest: [{
        src: 'test00.png',
        id: 'background'
      }]
    }),
    computed: {
      height () { return this.playground.canvas.height },
      width () { return this.playground.canvas.width }
    },
    methods: {
      onComplete () {
        this.loading = false
        this.playground = new createjs.Stage('playground')

        this.background = new createjs.Shape()
        this.background.graphics.beginBitmapFill(this.loader.getResult('background')).drawRect(0, 0, this.width, this.height)

        this.playground.addChild(this.background)
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
