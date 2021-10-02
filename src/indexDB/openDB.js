import config from "./baseSet.js";

const initIndexedDB = () => {
  const myIndexedDB =
    window.indexedDB ||
    window.webkitIndexedDB ||
    window.mozIndexedDB ||
    window.msIndexedDB;
  if (!myIndexedDB) {
    console.log("你的瀏覽器不支持IndexedDB");
  }

  let _db;

  const openDB = (dbName, version) => {
    const name = config.db_name || dbName;
    const ver = config.db_v || version;
    const dbRequest = myIndexedDB.open(name, ver);

    const dbPromise = new Promise((resolve, reject) => {
      dbRequest.onsuccess = (event) => {
        _db = dbRequest.result;
        resolve(_db);
      };

      dbRequest.onerror = (event) => {
        reject(event);
      };
    });

    dbRequest.onupgradeneeded = (event) => {
      _db = event.target.result;

      _db.createObjectStore(config.db_storeName, {
        keyPath: "id",
      });
    };

    return dbPromise;
  };

  const addObject = (storeName, object) => {
    const objectPromise = new Promise((resolve, reject) => {
      const _addObject = () => {
        const tranRequest = _db.transaction(storeName, "readwrite");
        tranRequest.objectStore(storeName).add(object);

        tranRequest.onsuccess = (event) => {
          resolve(event.target.result);
        };
        tranRequest.onerror = (event) => {
          reject(event);
        };
      };

      if (typeof _db === "undefined") {
        openDB().then(() => {
          _addObject();
        });
      } else {
        _addObject();
      }
    });
    return objectPromise;
  };

  const getObject = (storeName, id) => {
    const objectPromise = new Promise((resolve, reject) => {
      const _getObject = () => {
        const tranRequest = _db.transaction(storeName, "readonly");
        const store = tranRequest.objectStore(storeName);
        let dbRequest;
        if (typeof id === "undefined") {
          dbRequest = store.getAll();
        } else {
          dbRequest = store.get(id);
        }

        dbRequest.onsuccess = (event) => {
          resolve(event.target.result);
        };

        tranRequest.onerror = (event) => {
          reject(event);
        };
      };
      if (typeof _db === "undefined") {
        openDB().then(() => {
          _getObject();
        });
      } else {
        _getObject();
      }
    });

    return objectPromise;
  };

  const updateObject = (storeName, object) => {
    const objectPromise = new Promise((resolve, reject) => {
      const _updateObject = () => {
        const tranRequest = _db.transaction(storeName, "readwrite");

        let store = tranRequest.objectStore(storeName);

        store.get(object.id).onsuccess = (event) => {
          let newArr = addOrRemove(event.target.result.arr, object.arr[0]);
          const newObject = { id: object.id, arr: newArr };

          tranRequest.objectStore(storeName).put(newObject).onsuccess = (
            event
          ) => {
            if (config.debug) {
              console.log("updateObject ", event);
            }
            resolve(event.target.result);
          };
        };

        tranRequest.onerror = (event) => {
          reject(event);
        };
      };
      if (typeof _db === "undefined") {
        openDB().then(() => {
          _updateObject();
        });
      } else {
        _updateObject();
      }
    });
    return objectPromise;
  };

  return {
    openDB,
    addObject,
    getObject,
    updateObject,
  };
};

function addOrRemove(array, value) {
  let index;
  let newArr = [];

  newArr = newArr.concat(array);

  if (newArr.length == 0) {
    index = -1;
  } else {
    for (let i = 0; i < newArr.length; i++) {
      index = newArr[i].id == value.id ? i : -1;
    }
  }

  console.log(index);

  if (index === -1) {
    newArr.push(value);
  } else {
    newArr.splice(index, 1);
  }
  return newArr;
}

export default initIndexedDB;
