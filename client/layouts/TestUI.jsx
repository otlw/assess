// App component - represents the whole app
TestUI = React.createClass({

  // This mixin makes the getMeteorData method work
  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

// Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    return {
      events: Events.find({}, {sort: {createdAt: -1}}).fetch(),
      testelements: TestElements.find({}).fetch()
    }
  },

  renderEvents() {
    // Get tasks from this.data.tasks
    return this.data.events.fetch().map((events) => {
      return <Event key={events._id} eventx={events} />;
    });
  },

  renderTestElements() {
    // Get tasks from this.data.tasks
    return this.data.testelements.map((testelements) => {
      return <Event key={testelements._id} eventx={testelements} />;
    });
  },

  updateTokenBalance() {
    //Interpretation layer here
    //var text = getTokenBalance();
    var text = "234"
    TestElements.update({type: "Token Balance"}, {$set: {data: text}});
    Events.insert({
      type: "Event",
      text: "Updated token balance.",
      createdAt: new Date(),
    });
  },

  handleSubmit1(event) {
    event.preventDefault();

    //Interpretation layer here
    //var text = findTag(React.findDOMNode(this.refs.textInput1).value.trim());
    var text = "13532452363456";
    TestElements.update({type: "Tag Address"}, {$set: {data: text}});
    Events.insert({
      type: "Event",
      text: "Called for a tag address, look left.",
      createdAt: new Date(),
    });
    // Clear form
    React.findDOMNode(this.refs.textInput1).value = "";
  },

  handleSubmit2(event) {
    event.preventDefault();

    //Interpretation layer here
    //sendAssessmentRequest(React.findDOMNode(this.refs.textInput2).value.trim());
    Events.insert({
      type: "Event",
      text: "Started the assement process in a tag.",
      createdAt: new Date(),
    });

    // Clear form
    React.findDOMNode(this.refs.textInput2).value = "";
  },

  handleSubmit3(event) {
    event.preventDefault();

    //Interpretation layer here
    //submitScore(React.findDOMNode(this.refs.textInput3).value.trim());
    Events.insert({
      type: "Event",
      text: "Submitted a score.",
      createdAt: new Date(),
    });

    // Clear form
    React.findDOMNode(this.refs.textInput3).value = "";
  },

  handleSubmit4(event) {
    event.preventDefault();

    //Interpretation layer here
    //submitAssessment(React.findDOMNode(this.refs.textInput3).value.trim());
    Events.insert({
      type: "Event",
      text: "Submitted an assessment.",
      createdAt: new Date(),
    });

    // Clear form
    React.findDOMNode(this.refs.textInput4).value = "";
  },

  handleSubmit5(event) {
    event.preventDefault();

    //Interpretation layer here
    //submitAnswer(React.findDOMNode(this.refs.textInput3).value.trim());
    Events.insert({
      type: "Event",
      text: "Sumitted an answer for review.",
      createdAt: new Date(),
    });

    // Clear form
    React.findDOMNode(this.refs.textInput5).value = "";
  },

  render() {
    return (
      <div>
        <div id="test_sidebar">
          <p>Important info and events.</p>
          <ul id="test_list_wrapper">
            {this.renderEvents}
          </ul>
          <ul id="test_list_wrapper">
            {this.renderTestElements}
          </ul>
          <p>Events ({Events.find({}).count()})</p>
          <p>Test Elements ({TestElements.find({}).count()})</p>
        </div>
        <div id="test_wrapper">
          <form className="address_test" onSubmit={this.handleSubmit1} >
            <input
              type="text"
              ref="textInput1"
              placeholder="Find address from string..." />
          </form>
          <form className="assess_test" onSubmit={this.handleSubmit2} >
            <input
              type="text"
              ref="textInput2"
              placeholder="Submit to initiate assessment..." />
          </form>
          <form className="score_test" onSubmit={this.handleSubmit3} >
            <input
              type="text"
              ref="textInput3"
              placeholder="Submit a score..." />
          </form>
          <form className="sumbit_test" onSubmit={this.handleSubmit4} >
            <input
              type="text"
              ref="textInput4"
              placeholder="Submit a test..." />
          </form>
          <form className="sumbit_answer" onSubmit={this.handleSubmit5} >
            <input
              type="text"
              ref="textInput5"
              placeholder="Submit an answer..." />
          </form>
          <button type="button" onClick={this.updateTokenBalance}>Update Token Balance</button>
        </div>
      </div>
    );
  }
});
