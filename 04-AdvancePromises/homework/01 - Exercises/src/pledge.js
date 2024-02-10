'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
  if (typeof executor !== 'function') {
    throw TypeError('The executor must be a function')
  }

  this._state = 'pending';
  this._handlerGroups = [];
  // this._handlerGroups.errorCb = [];

  const resolver = (value) => {
    this._internalResolve(value);
  };
  
  const rejector = (value) => {
    this._internalReject(value);
  };

  try { executor(resolver, rejector); } catch(error) {
    rejector(error);
  }
  
};

$Promise.prototype._internalResolve = function (value) {
  if (this._state === "pending") {
    this._state = 'fulfilled'
    this._value = value;
    this._handlerGroups.forEach((han) => han.successCb(value));
  }
 }
$Promise.prototype._internalReject = function (value) {
  if (this._state === "pending") {
    this._state = 'rejected'
    this._value = value;
    this._handlerGroups.forEach((han) => han.errorCb(value));
  }
};

$Promise.prototype.then = function (onFulfill,onReject) {
  if (this._state === "fulfilled") {
     onFulfill(this._value);
  } else if (this._state === "rejected") {
    onReject(this._value);
  } else if (this._state === "pending") {
    // let auxObj = {};
    if (typeof onFulfill === "function" && typeof onReject === "function") {
      
      // const auxSuccessCb = () => {
      //   if (rejectedFromLastPromise instanceof $Promise) {
      //     rejectedFromLastPromise.then(resolver, rejector);
      //   } else {
      //     rejector(rejectedFromLastPromise);
      //   }
      // }
      // const auxErrorCb=() => {
      //   try {
      //     const rejectedFromLastPromise = onReject(this.value);
      //     rejector(rejectedFromLastPromise);
      //   } catch (error) {
      //     rejector(error);
      //   }
      // };

      const auxObj = { successCb: onFulfill, errorCb: onReject };
      this._handlerGroups.push(auxObj);
    } else if (typeof onFulfill !== 'function') {
      let auxObj = { successCb: false, errorCb: onReject };
      this._handlerGroups.push(auxObj);
      } else if (typeof onReject !== 'function') {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
} else if (typeof onReject !== "function") {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else if (typeof onFulfill !== "function" && typeof onReject !== "function") {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    }
  }
}
  

$Promise.prototype.catch = function (onReject) {
  if (this._state === "rejected") {
    this.then(null,onReject);
  } else if (this._state === "pending") {
    // let auxObj = {};
    if (typeof onFulfill === "function" && typeof onReject === "function") {
      let auxObj = { successCb: onFulfill, errorCb: onReject };
      this._handlerGroups.push(auxObj);
    } else if (typeof onFulfill !== "function") {
      let auxObj = { successCb: false, errorCb: onReject };
      this._handlerGroups.push(auxObj);
    } else if (typeof onReject !== "function") {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else if (typeof onReject !== "function") {
      let auxObj = { successCb: onFulfill, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else if (
      typeof onFulfill !== "function" &&
      typeof onReject !== "function"
    ) {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    } else {
      let auxObj = { successCb: false, errorCb: false };
      this._handlerGroups.push(auxObj);
    }
  }
};
  

$Promise.all = (promises) => {
  if (typeof promises !=='array') {
    throw TypeError
  } else {
    return new $Promise((resolve, reject) => {
      let counter = 0;
      const result = [];
      for (let i = 0; i < promises.length; i++) {
        resolve(promises[i]).then(
          (res) => {
            result[i] = res;
            counter += 1;
            // this check need to be here, otherwise counter would remain 0 till forloop is done
            if (counter === promises.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      }
    });
  };
};


$Promise.resolve = function (value) {
  if (value instanceof $Promise) {
    return value;
  } else {
    return new $Promise((resolver, rejector) => {
      resolver(value);
    });
  }
};


module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
