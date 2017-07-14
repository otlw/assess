const h = require('react-hyperscript')
const Component = require('react').Component



module.exports = class Compostion extends Component {
  constructor () {
    super()
  }

  render () {
    return h(`section.dict${this.props.fadeOut? '.animated.fadeOut' : '' }`, {
        style: {
          lineHeight: '26px'
        }
      }, [
        h('.row', {style: {alignItems: 'center'}}, [h('.title', {}, 'composition'), h('.sub-title-color.tab', {}, '|ˌkämpəˈziSH(ə)n|')]),
        h('.sub-title-color.tab', {}, 'noun'),
        h('div.first', {}, '1 the nature of something\'s ingredients or constituents; the way in which a whole or mixture is made up: the social composition of villages.'),
        h('.tab', {}, '• the action of putting things together; formation or construction: the composition of a new government was announced.'),
        h('.tab', {}, '• a thing composed of various elements: a theory is a composition of interrelated facts.'),
        h('.tab', {}, '• archaic mental constitution; character: persons who have a touch of madness in their composition.'),
        h('.tab', {}, ['• ', h('span.italic.peach-gray', '[often as modifier]'), ' a compound artificial substance, especially one serving the purpose of a natural one: composition flooring.']),
        h('.tab', {}, ['• ', h('span.italic.peach-gray', 'Linguistics '), 'the formation of words into a compound word.']),
        h('.tab', {}, ['• ', h('span.italic.peach-gray', 'Mathematics '), 'the successive application of functions to a variable, the value of the first function being the argument of the second, and so on: composition of functions, when defined, is associative.']),
        h('.tab', {}, ['• ', h('span.italic.peach-gray', 'Physics '), 'the process of finding the resultant of a number of forces.']),
        h('div.first', {}, '2 a work of music, literature, or art: Chopin\'s most romantic compositions.'),
        h('.tab', {}, '• the action or art of producing a work of music, literature, or art: the technical aspects of composition.'),
        h('.tab', {}, '• an essay, especially one written by a school or college student.'),
        h('.tab', {}, '• the artistic arrangement of the parts of a picture: spoiling the composition of many of the pictures.'),
        h('div.first', {}, '3 the preparing of text for printing by setting up the characters in order. See compose ( sense 4).'),
        h('div.first', {}, '4 a legal agreement to pay an amount of money in lieu of a larger debt or other obligation.'),
        h('.tab', {}, '• an amount of money paid under a legal agreement.'),
      ])
  }
}
