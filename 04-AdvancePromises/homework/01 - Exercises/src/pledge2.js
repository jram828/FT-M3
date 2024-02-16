return new $Promise((resolve, reject) => {
    if (this._state === "fulfilled") {
      try {
        const fulfilledFromLastPromise = onFulfill(this._value);
        if (fulfilledFromLastPromise instanceof $Promise) {
          fulfilledFromLastPromise.then(resolve, reject);
        } else {
          resolve(fulfilledFromLastPromise);
        }
      } catch (error) {
        reject(error);
      }
      // onFulfill(this._value);
    } else if (this._state === "rejected") {

      try {
        const rejectedFromLastPromise = onReject(this._value);
        if (rejectedFromLastPromise instanceof $Promise) {
          rejectedFromLastPromise.then(resolve, reject);
        } else {
          reject(rejectedFromLastPromise);
        }
      } catch (error) {
        reject(error);
      }
      // onReject(this._value);
    } else if (this._state === "pending") {
      // let auxObj = {};
      if (typeof onFulfill === "function" && typeof onReject === "function") {

        const auxSuccessCb = () => {
          try {
            const fulfilledFromLastPromise = onFulfill(this._value);
            if (fulfilledFromLastPromise instanceof $Promise) {
              fulfilledFromLastPromise.then(resolve, reject);
            } else {
              resolve(fulfilledFromLastPromise);
            }
          } catch (err) {
            reject(err);
          }
        };

        const auxErrorCb = () => {
          try {
            const rejectedFromLastPromise = onReject(this._value);
            if (rejectedFromLastPromise instanceof $Promise) {
              rejectedFromLastPromise.then(resolve, reject);
            } else {
              reject(rejectedFromLastPromise);
            }
          } catch (error) {
            reject(error);
          }
        };

        const auxObjDown = { successCb: auxSuccessCb, errorCb: auxErrorCb };
        this._handlerGroups.downstreamPromise.push(auxObjDown);

        const auxObj = { successCb: onFulfill, errorCb: onReject };
        this._handlerGroups.push(auxObj);

      } else if (
        typeof onFulfill !== "function" &&
        typeof onReject === "function"
      ) {
        let auxObj = { successCb: false, errorCb: onReject };
        this._handlerGroups.push(auxObj);
      } else if (
        typeof onReject !== "function" &&
        typeof onFulfill === "function"
      ) {
        let auxObj = { successCb: onFulfill, errorCb: false };
        this._handlerGroups.push(auxObj);
      } else {
        let auxObj = { successCb: false, errorCb: false };
        this._handlerGroups.push(auxObj);
      }
    }
  }
);
