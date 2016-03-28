// App component - represents the whole app
TestUI = React.createClass({

  // This mixin makes the getMeteorData method work
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    return {
    }
  },

  submitName(event) {
    event.preventDefault();

    //Interpretation layer here
    //var text = findTag(React.findDOMNode(this.refs.textInput1).value.trim());
    var text = '13532452363456';
    //Session.set("Current Tag", text);
    // Clear form
    React.findDOMNode(this.refs.nameInput).value = "";
  },

  submitAssessmentRequest(event) {
    event.preventDefault();

    //Interpretation layer here
    //sendAssessmentRequest(React.findDOMNode(this.refs.textInput2).value.trim());

    // Clear form
    React.findDOMNode(this.refs.assessmentAddress).value = "";
  },

  submitScore(event) {
    event.preventDefault();

    //Interpretation layer here
    //submitScore(React.findDOMNode(this.refs.textInput3).value.trim());

    // Clear form
    React.findDOMNode(this.refs.scoreInput).value = "";
  },

  submitTest(event) {
    event.preventDefault();

    //Interpretation layer here
    //submitAssessment(React.findDOMNode(this.refs.textInput3).value.trim());

    // Clear form
    React.findDOMNode(this.refs.testInput).value = "";
  },

  submitAnswer(event) {
    event.preventDefault();

    //Interpretation layer here
    //submitAnswer(React.findDOMNode(this.refs.textInput3).value.trim());

    // Clear form
    React.findDOMNode(this.refs.answerInput).value = "";
  },

  render() {
    return (
      <div>
        <div id="test_sidebar">
          <p>Return 4: {Master.return4()}</p>
        </div>
        <div id="test_wrapper">
          <form className="address_test" onSubmit={this.submitName} >
            <input
              type="text"
              ref="nameInput"
              placeholder="Find address from string..." />
          </form>
          <form className="assess_test" onSubmit={this.submitAssessmentRequest} >
            <input
              type="text"
              ref="assessmentAddress"
              placeholder="Submit to initiate assessment..." />
          </form>
          <form className="score_test" onSubmit={this.submitScore} >
            <input
              type="text"
              ref="scoreInput"
              placeholder="Submit a score..." />
          </form>
          <form className="sumbit_test" onSubmit={this.submitTest} >
            <input
              type="text"
              ref="testInput"
              placeholder="Submit a test..." />
          </form>
          <form className="sumbit_answer" onSubmit={this.submitAnswer} >
            <input
              type="text"
              ref="answerInput"
              placeholder="Submit an answer..." />
          </form>
          <button type="button" onClick={}>Update Token Balance</button>
        </div>
      </div>
    );
  }
});
