import { Component } from 'react'
import h from 'react-hyperscript'

export function LoadComponent (WrappedComponent) {
  return class Load extends Component {
    componentWillMount () {
      this.props.load()
    }

    render () {
      // return <WrappedComponent {...this.props} />
      return h(WrappedComponent, {...this.props})
    }
  }
}

export default LoadComponent
