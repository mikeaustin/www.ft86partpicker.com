import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    
    this.state = { value: "tires" };
  }
  
  handleCategoryChange(event) {
    //console.log(event.target.value);
    
    this.setState({ value: event.target.value });
  }
  
  render() {
    console.log("render");
    
    var filtered = this.props.items.filter(item => {
      //console.log(item.category + " " + this.state.value);
    
      return item.category == this.state.value;
    });
    
    ReactDOM.render(<PartList listItem={PartListItem} items={filtered} />, document.getElementById('parts-list'));
    
    var categories = this.props.items.reduce((set, item) => {
      return set.add(item.category);
    }, new Set());
    
    return (
      <select value={this.state.value} onChange={this.handleCategoryChange}>
        {
          Array.from(categories).map(category => {
            return <option value={category}>{category}</option>
          })
        }
      </select>
    );
  }
}

class PartListItem extends React.Component {
  render() {
    var style = {
      background: "white url(" + "http://localhost/www.ft86partpicker.com/images/" + encodeURI(this.props.item.image) + ") center no-repeat",
      backgroundSize: "auto 100%"
    };
    
    return (
      <li>
        <div className="image" style={style} />
        <div className="actions">
          <span className="price">$840</span>
        </div>
        <div className="description">
          <h1 className="heading">{this.props.item.name}</h1>
          <p>Inexpensive tilt-cast w/flow-forming lightweight wheels.</p>
        </div>
        <div className="details" style={{ marginLeft: "210px"}}>
          <div className="keys">
            Color:<br/>
            Width:<br/>
            Weight:<br/>
          </div>
          <div className="values">
            Silver, Black, Gray<br/>
            8, 8.5, 9.5 in<br/>
            20 lbs<br/>
          </div>
        </div>
      </li>
    );
  }
}

class PartList extends React.Component {
  render() {
    var ListItem = this.props.listItem;
    
    return (
      <ul>
      {
        this.props.items.map(item => {
          return <ListItem key={item["part-id"]} item={item} />
        })
      }
      </ul>
    );
  }
}

ReactDOM.render(<App items={partData} />, document.getElementById('app'));
