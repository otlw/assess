import {
  RECEIVE_CONCEPTS
} from '../actions/conceptActions'

let initialState = {}

/*
  further concepts are stored like this:

[
	conceptAddress : {
		description:string,
		learnMore:string,
		name:string
	},
	...
]

if the data is correctly stored on ipfs and

[
	conceptAddress:string,
	...
]


 */

function concepts (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CONCEPTS:
      return action.concepts
    default:
      return state
  }
}

export default concepts
