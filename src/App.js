import React, { Component } from "react";
import { Button, Input, List, Container } from "semantic-ui-react";
import { observer, inject } from "mobx-react";
import "./index.css";
import "semantic-ui-css/semantic.min.css";

const API_URL = "http://api.zippopotam.us/us/";
const TIMEOUT = 3000;
const MIN_LENGHT_ZIPCODE = 5;
const CITY_EXIST = "City was already added";
const INVALID_ZIP = "Invalid zip-code";

const isCityExist = (cities, zipCode) =>
  cities.some(city => city.zipCode === zipCode);

const ListComponent = ({ cities = [], onSelectCity, selectedZipCode }) => {
  return (
    <List>
      {cities.map(city => (
        <ListItem
          key={`${city.zipCode}`}
          onSelectCity={onSelectCity}
          city={city}
          selected={selectedZipCode === city.zipCode}
        />
      ))}
    </List>
  );
};

const ListItem = ({ city, onSelectCity, selected }) => (
  <List.Item key={`${city.zipCode}`}>
    <List.Content>
      <List.Description
        as="button"
        onClick={() => onSelectCity(city)}
        style={{ background: selected ? "#34d04e" : "#FFF" }}
      >
        {city.placeName}, {city.state}
      </List.Description>
    </List.Content>
  </List.Item>
);

@inject("store")
@observer
class App extends Component {
  setError = type => {
    const { store } = this.props;
    store.errorMessage = type;
    setTimeout(store.clearError, TIMEOUT);
  };

  isErrorResponse = resp => {
    if (resp.status !== 200) {
      this.props.store.turnOffLoader();
      this.setError(INVALID_ZIP);
    }

    return resp.json();
  };

  isRequestSuccess = ({ places }) => {
    const { store } = this.props;

    store.turnOffLoader();

    if (places && places.length) {
      store.addCity(places[0]);
    }
  };

  onAddCity = () => {
    const { store } = this.props;
    if (!store.searchString) return null;
    const url = `${API_URL}${store.searchString}`;

    if (isCityExist(store.cities, store.searchString)) {
      this.setError(CITY_EXIST);
    } else {
      store.turnOnLoader();
      fetch(url)
        .then(this.isErrorResponse)
        .then(this.isRequestSuccess)
        .catch(console.log);
    }
  };

  renderError = () => {
    const { errorMessage } = this.props.store;
    return errorMessage ? <p className="error">{errorMessage}</p> : null;
  };

  render() {
    const {
      searchString,
      inputLoader,
      onSelectCity,
      cities,
      selectedZipCode,
      handleChange
    } = this.props.store;

    return (
      <Container className="App">
        <div className="form">
          <Input
            className="searchInput"
            placeholder="Search..."
            value={searchString}
            onChange={handleChange}
          />
          <Button
            primary
            loading={inputLoader}
            disabled={
              inputLoader || searchString.length < MIN_LENGHT_ZIPCODE
            }
            onClick={this.onAddCity}
            className="addButton"
          >
            go
          </Button>
          {this.renderError()}
        </div>
        <ListComponent
          cities={cities}
          onSelectCity={onSelectCity}
          selectedZipCode={selectedZipCode}
        />
      </Container>
    );
  }
}

export default App;
