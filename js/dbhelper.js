/**
 * Common database helper functions.
 */
//import idb from 'idb';

const idbApp = (function() {
  'use strict';
  
  const dbPromise = idb.open('restaurant-db', 1, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore("restaurants", { keyPath: "id" });
    }
  });
  
  function addRestaurantById(restaurant) {
    return dbPromise.then(function(db) {
      const tx = db.transaction('restaurants', 'readwrite');
      const store = tx.objectStore('restaurants');
      store.put(restaurant);
      return tx.complete;
    }).catch(function(error) {
      console.log("Error adding restaurant to IndexedDB", error);
    });
  }

  function fetchRestaurantById(id) {
    return dbPromise.then(function(db) {
      const tx = db.transaction('restaurants');
      const store = tx.objectStore('restaurants');
      return store.get(parseInt(id));
    }).then(function(restaurantObject) {
      return restaurantObject;
    }).catch(function(error) {
      console.log("Error fetching restaurant from IndexedDB", error);
    });
  }    
 /*   
  function addRestaurants() {
    return dbPromise.then(db => {
      fetch('http://localhost:1337/restaurants/').then(function(response) {
      return response.json();
    })
    .then(function(restaurantJSON) {
      var tx = db.transaction('restaurants', 'readwrite');
      var store = tx.objectStore('restaurants');
      restaurantJSON.forEach(function(restaurant) {
        store.put(restaurant);
    });
    //return store.getAll();
    return tx.complete;
  }).catch(function(e) {
      console.log("idbApp.fetchRestaurantById errored out:", e);
    });                    
  });
 }
 
 function getRestaurants() {
   return dbPromise.then(db => {
      const tx = db.transaction('restaurants');
      const store = tx.objectStore('restaurants');
      return store.getAll();
    });
 }
 */
  return {
    dbPromise: (dbPromise),
    addRestaurantById: (addRestaurantById),
    fetchRestaurantById: (fetchRestaurantById),
  };
})();



//idbApp.addRestaurants();


class DBHelper {


  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
  /*
    const port = 8000; // Change this to your server port
    return 'http://localhost:${port}/data/restaurants.json';
    */
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }
  /*
  static getRestaurantsIDB () {
  		return idbApp.getRestaurants();
  }
*/
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
      /*
  DBHelper.getRestaurantsIDB().then(function(data) {
    if (data.length > 0) {
      return callback(null, data);
    }
  })
  */
  let fetchURL = DBHelper.DATABASE_URL;
  fetch(fetchURL)
  .then(function(response){
  	  response.json().then(function(restaurantJSON) { 
         callback(null, restaurantJSON);
      });
  })
  .catch(e => {
   console.log(e);
    const error = `Request failed. Returned ${e}`;
    callback(error, null);
  }); 
  /*
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  */
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    const idbRestaurant = idbApp.fetchRestaurantById(id);
    idbRestaurant.then(function(idbRestaurantObject) {
    if (idbRestaurantObject) {
        console.log("fetching restaurant by id from IndexedDB");
        callback(null, idbRestaurantObject);
        return;
    }
    else {
      DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          // add to IndexDB
          //let idbMessages = idbApp.addRestaurantById(restaurant);    
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
              }
          }
        });
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {

      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    idbApp.addRestaurantById(restaurant); 
    return (`/img/${restaurant.photograph}.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
