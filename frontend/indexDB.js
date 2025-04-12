export class FavoriteList{
    constructor(dbName) {
      this.dbName = dbName;
    }
  
    // Method to open the database
    async openDatabase() {
      return new Promise((resolve, reject) => {
        if (this.dbName === "") {
          reject("Database name cannot be empty.");
          return;
        }
  
        let request = indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = function (event) {
          let db = event.target.result;
          if (!db.objectStoreNames.contains("Locations")) {
            db.createObjectStore("Location", { keyPath: "id" });
          }
        };
        request.onsuccess = function (event) {
          resolve(event.target.result);
        };
        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    }
  
    // Method to add a Location
    async addLocation(location) {
      const db = await this.openDatabase();
      const tx = db.transaction("Locations", "readwrite");
      const store = tx.objectStore("Locations");
      store.add(location);
  
      return new Promise((resolve, reject) => {
        tx.oncomplete = function () {
          resolve("Location added successfully!");
        };
        tx.onerror = function () {
          reject("Failed to add Location.");
        };
      });
    }
  
    // Method to get all tasks
    async getLocations() {
      // TASK: Implement this method
      const db = await this.openDatabase();
      const tx = db.transaction("Locations", "readwrite");
      const store = tx.objectStore("Locations");
      const locations = store.getAll();
  
      return new Promise((resolve, reject) => {
        locations.onsuccess = function () {
          resolve(tasks.result);
        };
        locations.onerror = function () {
          reject("Failed to get tasks.");
        };
        tx.onerror = function () {
          reject("Failed to get tasks.");
        };
      });
    }
  
    // Method to delete a task by its ID
    async deleteTask(locationId) {
      // TASK: Implement this method
      const db = await this.openDatabase();
      const tx = db.transaction("tasks", "readwrite");
      const store = tx.objectStore("tasks");
      const del = store.delete(locationsId);
  
      return new Promise((resolve, reject) => {
        del.onsuccess = function () {
          resolve("Task deleted successfully!");
        };
        del.onerror = function () {
          reject("Failed to delete task.");
        };
        tx.onerror = function () {
          reject("Failed to delete task.");
        };
      });
    }
  }
  
