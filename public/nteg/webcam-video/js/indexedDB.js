var indexedDBName = "AsyncIndexedDB2";
var version = "2.0";
var read_only = 1;
var read_write = 0;
var version_change = 2;

var objNames =
        [
           "KIDSTORE", "CANDYSTORE"
        ];

var OBJECTSTORES =
        [
          { name: "KIDSTORE", keyPath: "id", autoIncrement: true },
          { name: "CANDYSTORE", keyPath: "id", autoIncrement: false },
          { name: "CANDYSALESTORE", keyPath: "id", autoIncrement: true }
        ];

var kidsData =
        [
          { name: "Anna", number: 1000 },
          { name: "Betty", number: 1001 },
          { name: "Christine", number: 1002 },
          { name: "Amy", number: 1003 },
          { name: "Linda", number: 1004 },
          { name: "Lincoln", number: 1005 }
        ];

var kidsDataUpdate =
        [
          { id: 100, name: "Anna", number: 2000 },
          { id: 101, name: "Betty", number: 2001 },
          { id: 102, name: "Christine", number: 2002 },
          { id: 103, name: "Amy", number: 2003 },
          { id: 104, name: "Linda", number: 2004 },
          { id: 105, name: "Lincoln", number: 2005 }
        ];

var candyData =
        [
//need id since autoIncrement is set false, i.e. key generator is turned off        
          {id: 10, name: "candy1", weight: 100 },
          { id: 11, name: "candy2", weight: 200 },
          { id: 12, name: "candy3", weight: 300 },
          { id: 13, name: "candy4", weight: 400 }
        ];

///////////////////////////////////
//utility functions
////////////////////////////////////

function PrintDBInformation(idb) {
    if (idb) {
        var sName = idb.name;
        var dVersion = idb.version;
        var dTableNames = idb.objectStoreNames;
        var strNames = "IndexedDB name: " + sName
                              + "; version: " + dVersion + "; object stores: ";
        for (var i = 0; i < dTableNames.length; i++) {
            strNames = strNames + dTableNames[i] + ", ";
        }
        console.log(strNames);
    }
}

function PrintRecord(tTable, tRecord) {
    if (tRecord != undefined) {
        if (tTable == "KIDSTORE") {
            console.log("( " + tRecord.id + "," + tRecord.name + "," + tRecord.number + ")");
        }
        else if (tTable == "CANDYSTORE") {
            console.log("( " + tRecord.id + "," + tRecord.name + "," + tRecord.weight + ")");
        }
        else if (tTable == "CANDYSALESTORE") {
        }
    }
}

function create_openDB() {
    try {
        var dbreq = window.indexedDB.open(indexedDBName);
        dbreq.onsuccess = function (event) {
            var db = dbreq.result;
            //db.setVersion("1.0");
            db.close();
            Async_createObjectStores_versionChange_commit();
            
        }
        dbreq.onerror = function (event) {
            console.log("indexedDB.open Error: " + event.message);
        }
    }
    catch (e) {
        console.log("Error: " + e.message);
    }
}

function Async_createObjectStores_versionChange_commit() {
    Async_createObjectStores(true);
}

function Async_createObjectStores_versionChange_abort() {
    Async_createObjectStores(false);
}

function Async_createObjectStores(txnCommit) {
    try {
        var dbreq = window.indexedDB.open(indexedDBName);
        dbreq.onsuccess = function (event) {
            var db = dbreq.result;
            PrintDBInformation(db);
            dbreq.onupgradeneeded = function (event) {
                var txn = event.currentTarget.result;
                if (txn) {
                    txn.oncomplete = function () {
                        console.log("createObjectStore completed.");
                        PrintDBInformation(db);
                        db.close();
                    }
                    txn.onabort = function () {
                        console.log("createObjectStore aborted.");
                        PrintDBInformation(db);
                        db.close();
                    }
                    txn.ontimeout = function () {
                        console.log("createObjectStore timeout.");
                        PrintDBInformation(db);
                        db.close();
                    }
                    try {
                        for (var i = 0; i < OBJECTSTORES.length; i++) {
                            var params = OBJECTSTORES[i];
                            var store = db.createObjectStore(params.name,
                               params.keyPath, params.autoIncrement);
                        }
                        if (txnCommit == true)
                            txn.commit();
                        else
                            txn.abort();
                    }
                    catch (e) {
                        console.log("createObjectStore exception: " + e.message);
                        txn.abort();
                    }

                }
            }
            setVerReq.onerror = function (event) {
                console.log("db.setVersion error. " + event.message);
                db.close();
            }
            setVerReq.onblocked = function (event) {
                console.log("db.setVersion blocked. " + event.message);
                db.close();
            }
        }
        dbreq.onerror = function (event) {
            console.log("indexedDB.open Error: " + event.message);
        }
    }
    catch (e) {
        console.log("Error: " + e.message);
    }
}