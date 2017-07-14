const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect

function mapStateToProps (state) {
  return {}
}
class NewComponent extends Component {
  render () {
    const props = this.props

    return h('div', {
        style: {
          background: 'blue',
        },
      }, [
        `Hello, ${props.sender}`,
      ])

  }
}

module.exports = connect(mapStateToProps)(NewComponent)
