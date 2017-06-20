<template>
  <div id="feedback" class="ui segment">
    <div class="ui dimmer" :class="{ active: playground.loading }">
      <div class="ui huge text loader">Loading</div>
    </div>
    <canvas id="playground" ref="playground" width="1024" height="896"></canvas>
  </div>
</template>

<script>
  import playground from './engine/playground'
  import entrance from './stage/entrance-stage'
  import 'semantic-ui-css/semantic.min.css'

  export default {
    data: () => ({
      playground: playground
    }),
    mounted () {
      this.playground.stages.push(entrance)
      this.playground.load()
    },
    tick (event) {
      if (this.bradley.currentAnimation === 'walking') {
        let deltaS = event.delta / 1000
        let position = this.bradley.x + 122 * deltaS
        let bradleyWidth = this.bradley.getBounds().width * this.bradley.scaleX
        this.bradley.x = (position >= this.width + bradleyWidth) ? -bradleyWidth : position
      }

      if (this.changeAnimation) {
        const animation = this.bradley.currentAnimation
        const frameIndex = this.bradley.currentAnimationFrame
        if (animation === 'walking' && ((frameIndex >= 5 && frameIndex <= 6) || frameIndex >= 11)) {
          this.bradley.gotoAndPlay('standing')
          this.changeAnimation = false
        }
      }
      this.playground.update()
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
    background-color: #2c3e50 !important;
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
