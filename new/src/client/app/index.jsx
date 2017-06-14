import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      partids: this.extractPartIds(location.hash),
      setup: new Map(),
      category: "wheels"
    }
  }
  
  componentDidMount() {
    window.addEventListener("hashchange", event => {
      this.setState({
        partids: this.extractPartIds(location.hash)
      });
    }, false);
  }

  extractPartIds(hash) {
    var parts = location.hash.slice(1);

    return parts === "" ? [] : parts.split(",").map(id => parseInt(id));
  }

  changeCategory(category, event) {
    this.setState({
      category: category
    });

    event.preventDefault();
  }
  
  render() {
    var partsListItems = Array.from(this.props.items.values()).filter(item => item.category === this.state.category);
    var setupListItems = this.state.partids.map(partid => this.props.items.get(partid));
    var activeCategory = this.state.category;
    
    var setupTotal = setupListItems.reduce((total, item) => total + item.price * (item.quantity ? item.quantity : 1), 0);

    if (this.state.category === null) {
      partsListItems = setupListItems;
    }

    var className = activeCategory === null ? "active" : "";

    return (
      <div>
        <div id="setup-list">
          <header className="setup-list">
            <div className="section">
              <h1>
                <button className={className} onClick={(event) => this.changeCategory(null, event)}>
                  <span className="total">${setupTotal}</span>Current Setup
                </button>
              </h1>
            </div>
          </header>
          <div style={{paddingTop: "52px"}}>
            <SetupList items={setupListItems} activeCategory={activeCategory}
                       onChangeCategory={this.changeCategory.bind(this)} />
          </div>
        </div>
        <div id="parts-list">
          <header>
          </header>
          <div style={{paddingTop: "52px"}}>
            <PartsList items={partsListItems} partids={this.state.partids} />
          </div>
        </div>
      </div>
    );
  }
  
}

// const List = (props) => {
//   return (
//     <ul>
//     {
//       props.items.map(item => React.Children.map(props.children, child => {
//         return React.cloneElement(child, {key: props.getKey(item), item: item});
//       }))
//     }
//     </ul>
//   );
// };


//
// SetupList
//

class SetupList extends React.PureComponent {

  constructor(props) {
    super(props);
  }
  
  changeCategory(category, event) {
    this.props.onChangeCategory(category, event);
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
      <div className="setup-list">
      {
        Array.from(sections).map(([section, items]) => {
          var className = section === this.props.activeCategory ? "active" : "";
          
          return (
            <div key={section} className="section">
              <h1><button className={className} onClick={(event) => this.changeCategory(section, event)}>{section}</button></h1>
              <ul>
                { items.map(item => <SetupListItem key={item['part-id']} item={item} />) }
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


//
// PartsList
//

class PartsList extends React.PureComponent {

  constructor(props) {
    super(props);

    this.partids = props.partids;
  }
  
  addPart(id) {
    var parts = location.hash.slice(1);

    window.location.hash = "#" + (parts === "" ? [] : parts.split(",")).concat([id.toString()]).join(",");
  }

  removePart(id) {
    var parts = location.hash.slice(1);

    window.location.hash = "#" + (parts === "" ? [] : parts.split(",")).filter(partId => parseInt(partId) !== id).join(",");
  }

  render() {
    return (
      <ul className="parts-list">
      {
        Array.from(this.props.items).map((item) => {
          var inSetup = this.props.partids.includes(item['part-id']);
          var action = inSetup ? this.removePart : this.addPart,
              actionTitle = inSetup ? "DEL" : "ADD";

          return <PartsListItem key={item['part-id']} item={item} onAction={action} actionTitle={actionTitle} />
        })
      }
      </ul>
    );
  }

}

function PartsListItem(props) {
  return (
    <li>
      <div className="image" style={{ backgroundImage: "url(../images/" + encodeURIComponent(props.item.image) + ")" }} />
      <div className="actions">
        <button className="action" onClick={() => props.onAction(props.item["part-id"])}>{props.actionTitle}</button>
      </div>
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


ReactDOM.render(<App items={items} />, document.getElementById('app'));
