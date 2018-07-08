import React from 'react';
import elasticsearch from "elasticsearch";
import logo from './logo.svg';
import './App.css';
import ReactTable from "react-table";
import "react-table/react-table.css";

let client = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace",
  requestTimeout: Infinity,
  keepAlive: true 

});
let indexName = 'test';
class App extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
		<img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React example using elasticsearch.js </h1>
        </header>
        <p className="App-intro">
          This example show :
        </p>
		<p className="App-intro">
		  How to create document into elasticsearch backend  using Reactjs.
        </p>
		<p className="App-intro">
		  How to retrive datas from elastic search and  display them  in data table.
        </p>
		<SubmitForm></SubmitForm>
		<SearchForm></SearchForm>
      </div>
    );
  };
}


class SearchForm extends React.Component {
	constructor(props) {
      super(props);
      this.state = {
         searchText: '',
	     results: [] 
      }
      this.updateState = this.updateState.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
   };
   updateState(e) {
      this.setState({searchText: e.target.value});
   }
	handleSearch(event) {
	 const search_query = this.state.searchText;
	 return client.search({
		index: indexName,
		q: 'user_agent:' + search_query
	 }).then(function(body){
		 console.log(body)
		 this.setState({ results: body.hits.hits });
	 }.bind(this),function(error){
		  console.log(error)
	 });

    event.preventDefault();
  }
  render() {
	  const  data  = this.state.results;
    return (
     <div>
            <input value = {this.state.data} onChange = {this.updateState} 
               ref = "myInput"></input>
            <button onClick = {this.handleSearch}>Search</button>
			<hr />
			<div>
			<ReactTable
				  data={data}
				  columns={[
					{
					  Header: "Infos",
					  columns: [
						{
						  Header: "Post date",
						  accessor: "_source.published_at"
						},
						{
						  Header: "Browser infos",
						  id: "_source.user_agent",
						  accessor: d => d._source.user_agent
						}
					  ]
					}
				  ]}
				  defaultPageSize={10}
				  className="-striped -highlight"
			/>
		  </div>
         </div>

    );
  };
}
class SubmitForm extends React.Component {
     
	handleSubmit(event) {
		const existsIndexPromise =  client.indices.exists({
			index: indexName
		});
		existsIndexPromise.then(function(exists){
			if(!exists){
				const initIndexPromise = client.indices.create({
					index: indexName
					});
				initIndexPromise.then(function(){
					return  client.indices.putMapping({
						index: indexName,
						type: 'userAgent',
						body: {
							properties: {
								user_agent: { type: 'text' },
								published_at: {type: 'date'}
							}
						}
					});
							
				});
				
			}
		}).then(function(){
			const postPromise = client.index({
							index:indexName,
							type: 'userAgent',
							body: {
								user_agent: navigator.userAgent,
								published_at: new Date()
							}
						});
			postPromise.then(function(results){
							console.log('Post  data  ', results);
				})
		})
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
