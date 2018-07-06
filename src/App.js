import React, { Component } from 'react';
import elasticsearch from "elasticsearch";
import logo from './logo.svg';
import './App.css';
let client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace",
  requestTimeout: Infinity,
  keepAlive: true // Tested

});
class App extends Component {
	/*handleSubmit(event) {
    alert('A name was submitted: ' + navigator.userAgent);
    event.preventDefault();
  }*/
  constructor(props) {
    super(props);

    this.state = { results: [] };
  };
  handleChange(event) {
    const search_query = event.target.value;

    client
      .search({
        q: search_query
      })
      .then(
        function(body) {
          this.setState({ results: body.hits.hits });
        }.bind(this),
        function(error) {
          console.trace(error.message);
        }
      );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
		<img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
		<SubmitForm></SubmitForm>
		 
      </div>
    );
  };
}

class SubmitForm extends Component {
	handleSubmit(event) {
    //alert('A name was submitted: ' + navigator.userAgent);
	client.ping({
		}, function (error) {
		  if (error) {
			console.error('elasticsearch cluster is down!');
		} else {
			console.log('All is well');
		}
	});
    event.preventDefault();
  }
  render() {
    return (
      <div className="App">
		<form onSubmit={this.handleSubmit}>
		 Create elastic search document <input type="submit" value="Create" />
		 </form>
		 
      </div>
    );
  };
}
export default App;
