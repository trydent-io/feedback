import createjs from 'createjs-easeljs'
import doumun from '../doumun'

const manifest = (id) => ({ id: id, src: `${id}.png` })

const Background = manifest('background')
const EntranceFront = manifest('entrance_front')
const Receptionist = manifest('receptionist')
const OfficialEntrance = manifest('official_entrance')
const Tree = manifest('tree')

export default {
  beforeLoad (assets) {
    console.log('Before the load!')
    assets.manifest = [
      Background,
      Tree,
      Receptionist,
      doumun.manifest,
      EntranceFront,
      OfficialEntrance
    ]
  },
  loaded (assets, stage) {
    this.background = new createjs.Shape()
    this.background.graphics.beginBitmapFill(assets.get(Background.id)).drawRect(0, 0, stage.canvas.width, stage.canvas.height)

    this.entranceFront = new createjs.Bitmap(assets.get(EntranceFront.id))
    this.entranceFront.x = 288 - this.entranceFront.image.width
    this.entranceFront.y = 32 * 27 - this.entranceFront.image.height

    this.receptionist = new createjs.Bitmap(assets.get(Receptionist.id))
    this.receptionist.x = 640 - this.receptionist.image.width
    this.receptionist.y = 32 * 27 - this.receptionist.image.height

    this.officialEntrance = new createjs.Bitmap(assets.get(OfficialEntrance.id))
    this.officialEntrance.x = 1024 - this.officialEntrance.image.width
    this.officialEntrance.y = 32 * 27 - this.officialEntrance.image.height

    this.tree = new createjs.Bitmap(assets.get(Tree.id))
    this.tree.x = 974 - this.tree.image.width
    this.tree.y = 32 * 27 - this.tree.image.height

    this.doumun = doumun.loaded(assets, stage)

    stage.addChild(
      this.background,
      this.tree,
      this.receptionist,
      this.doumun.sprite,
      this.entranceFront,
      this.officialEntrance
    )
  },

  ticked (playground) {
    this.doumun.ticked(playground)
  },

  keyDown (event, playground) { this.doumun.keyDown(event) },
  keyUp (event, playground) { this.doumun.keyUp(event) }
}

