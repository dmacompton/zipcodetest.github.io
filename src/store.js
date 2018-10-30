import { observable, action } from "mobx";

class City {
  @observable placeName;
  @observable state;
  @observable zipCode;

  constructor(city, zipCode) {
    this.placeName = city["place name"];
    this.state = city["state abbreviation"];
    this.zipCode = zipCode;
  }
}

class CityStore {
  @observable cities = [
    {
      placeName: "New York",
      state: "NY",
      zipCode: "10001"
    },
    {
      placeName: "Odessa",
      state: "OD",
      zipCode: "65113"
    }
  ];
  @observable searchString = "";
  @observable inputLoader = false;
  @observable errorMessage = "";
  @observable selectedZipCode = null;

  @action
  addCity(city) {
    this.cities = [...this.cities, new City(city, this.searchString)];
    this.searchString = "";
  }

  @action.bound
  handleChange(e) {
    this.searchString = e.target.value;
  }

  @action.bound
  clearError() {
    this.errorMessage = "";
  };

  @action.bound
  turnOnLoader() {
    this.inputLoader = true;
  };

  @action.bound
  turnOffLoader() {
    this.inputLoader = false;
  };

  @action.bound
  onSelectCity(place) {
    if (this.selectedZipCode === place.zipCode) {
      this.selectedZipCode = null;
      this.searchString = "";
    } else {
      this.selectedZipCode = place.zipCode;
      this.searchString = place.zipCode;
    }
  }
}

const store = new CityStore();

export default store;
