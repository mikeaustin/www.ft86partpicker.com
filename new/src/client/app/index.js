import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      partids: [107, 207, 301, 401, 500],
      category: "wheels"
    }
  }
  
  onChangeCategory(category) {
    this.setState({
      category: category
    });
  }
  
  render() {
    var setupListStyle = {
      float: "left"
    }
    
    var partsListStyle = {
      marginLeft: "300px"
    }

    var partsListItems = Array.from(this.props.items.values()).filter(item => item.category === this.state.category);
    var setupListItems = this.state.partids.map(partid => this.props.items.get(partid));
    var activeCategory = this.state.category;
    
    return (
      <div>
        <div id="setup-list">
          <SetupList items={setupListItems} activeCategory={activeCategory} onChangeCategory={this.onChangeCategory.bind(this)} />
        </div>
        <div id="parts-list">
          <PartsList items={partsListItems} />
        </div>
      </div>
    );
  }
}

class SetupList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  changeCategory(category) {
    this.props.onChangeCategory(category);
  }
  
  render() {
    var sections = ["wheels", "suspension", "engine", "drivetrain", "braces", "cosmetic"].reduce((map, section) => {
      return map.set(section, []);
    }, new Map());

    this.props.items.forEach((item, partid) => {
      var section = item.section ? item.section : item.category;
      
      sections.get(section).push(item);
    });

    return (
      <div>
        {
          Array.from(sections).map(([section, items]) => {
          console.log(section === this.props.activeCategory);
            var className = section === this.props.activeCategory ? "active" : "";
            
            return (
              <div key={section} className="section">
                <h1><a href="#" className={className} onClick={() => this.changeCategory(section)}>{section}</a></h1>
                <ul>
                  {
                    items.map(item => {
                      return <SetupListItem key={item['part-id']} item={item} />
                    })
                  }
                </ul>
              </div>
            );
          })
        }
      </div>
    );
  }
}

function SetupListItem(props) {
  return (
    <li>
      <div className="price">${ props.item.price }</div>
      <div>{ props.item.name }</div>
    </li>
  )
}

/*
            <ul>
              {
                items.map(item => {
                  return <li key={item['part-id']}>{ item.name }</li>
                })
              }
            </ul>

      <ul>
        {
          this.props.partids.map(partid => {
            return <li key={partid}>{ this.props.items.get(partid).name }</li>
          })
        }
      </ul>
*/

class PartsList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <ul>
        {
          Array.from(this.props.items.entries()).map(([partid, item]) => {
            return <PartsListItem key={partid} item={item} />
          })
        }
      </ul>
    );
  }
}

function PartsListItem(props) {
  return (
    <li>
      <div className="image" style={{ backgroundImage: "url(../images/" + props.item.image + ")" }} />
      <div className="description">
        <h1 className="header">{ props.item.name }</h1>
        <p>Inexpensive tilt-cast w/flow-forming lightweight wheels.</p>
      </div>
    </li>
  )
}

var items = partData.reduce((map, item) => {
  return map.set(item['part-id'], item);
}, new Map());

render(<App items={items} />, document.getElementById('app'));
