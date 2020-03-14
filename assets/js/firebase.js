var db = firebase.firestore();
console.log("Database connection successful",db);
getStockPrices();
getUserDetails();
var key,userKey,userStockKey ;


function submitForm(){
    var stockName =  $('#stockName').val(),
        stockPrice =  $('#stockPrice').val(),
        stockChange =  $('#stockChange').val(),
        stockVolume =  $('#stockVolume').val();
    
    var sfDocRef = db.collection("stocks").doc(key);
    db.runTransaction(function(transaction) {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(sfDocRef).then(function(sfDoc) {
        if (!sfDoc.exists) {
            throw "Document does not exist!";
        }
        transaction.update(sfDocRef, { price: parseFloat(stockPrice), change: parseFloat(stockChange), volume: parseInt(stockVolume) });
    });
    }).then(function() {
        key = '';

        console.log("Transaction successfully committed!");
        $('#stocksModal').modal('hide');
        
    }).catch(function(error) {
        console.log("Transaction failed: ", error);
    });

    

}

function editButtonClicked(e){
    $('#stockName').attr("disabled",true);
    $('#submit-model').removeClass("d-none");
    $('#save-model').addClass("d-none");

     var modal = document.getElementById('model-form');
    key = e.target.getAttribute('stockid');
    var docRef = db.collection("stocks").doc(key);
    docRef.get().then(function(doc){
         if (doc.exists) {
             data = doc.data();
             $('#stockName').val(data['name']);
             $('#stockPrice').val(data['price']);
             $('#stockChange').val(data['change']);
             $('#stockVolume').val(data['volume']);
             console.log(data);
         } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    })
}

function removeTableItems(elementId){
     var tableLength = document.getElementById(elementId).rows.length;    
    if (tableLength > 1 ){
        for(var i = tableLength; i > 1;i--){
         document.getElementById(elementId).deleteRow(i-1);
        }
    }
    else{
        console.log('Empty Table');
    }
}
function getStockPrices(){
    var docRef = db.collection("stocks");

    docRef.onSnapshot(function(querySnapshot) {
        removeTableItems('admin-table');
        i = 1
        querySnapshot.forEach(function(doc){
            if (doc.exists) {
            var table = document.getElementById('admin-table').getElementsByTagName('tbody')[0];
            var row = table.insertRow();
            var firebaseData = doc.data();
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            var cell5 = row.insertCell(5);
            if(firebaseData){
                cell0.outerHTML= `<th scope="row"> ${i} </th>`;
                cell1.innerHTML= firebaseData['name'].toUpperCase();
                cell2.innerHTML= firebaseData['price'];
                cell3.innerHTML= firebaseData['change'];
                cell4.innerHTML= firebaseData['volume'];
                cell5.innerHTML = `<i class="ti-pencil-alt" id="edit-stock${i}" data-toggle="modal" data-target="#stocksModal" type="button"></i>`;
                let editIcon = document.getElementById(`edit-stock${i}`),
                    key = doc.id;
                editIcon.addEventListener("click", editButtonClicked);
                editIcon.setAttribute("stockid",key);
                
            }
            i++;
            console.log("Document data:", firebaseData);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }
        );
        
    });
}

function getUserDetails(){
    var docRef = db.collection("users");

    docRef.get().then(function(querySnapshot) {
    i = 1
    querySnapshot.forEach(function(doc){
        if (doc.exists) {
        var table = document.getElementById('users-table').getElementsByTagName('tbody')[0];
        var row = table.insertRow();
        var firebaseData = doc.data();
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        if(firebaseData){
            cell0.outerHTML= `<th scope="row"> ${i} </th>`;
            cell1.innerHTML= firebaseData['username'].toUpperCase();
            cell2.innerHTML= firebaseData['email'];
             cell3.innerHTML = `<i class="ti-pencil-alt" id="detail-user${i}" data-toggle="modal" data-target="#userStockModal" type="button"></i>`;
                let editIcon = document.getElementById(`detail-user${i}`),
                    userKey = doc.id;
                editIcon.addEventListener("click", getUserStock);
                editIcon.setAttribute("userid",userKey);
        }
        i++;
        console.log("Document data:", firebaseData);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }
    );
    
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function getUserStock(e){
    userKey = e.target.getAttribute('userid');
    var docRef = db.collection("users").doc(userKey).collection("mystocks");
    docRef.get().then(
        function(querySnapshot){
            removeTableItems('userStockTable');
            i=1;
            querySnapshot.forEach(function(doc){
                  if (doc.exists) {
                    var table = document.getElementById('userStockTable').getElementsByTagName('tbody')[0];
                    var row = table.insertRow();
                    var firebaseData = doc.data();
                    var cell0 = row.insertCell(0);
                    var cell1 = row.insertCell(1);
                    var cell2 = row.insertCell(2);
                    var cell3 = row.insertCell(3);
                    var cell4 = row.insertCell(4);
                    if(firebaseData){
                        cell0.outerHTML= `<th scope="row"> ${i} </th>`;
                        cell1.innerHTML= firebaseData['stockName'].toUpperCase();
                        cell2.innerHTML= firebaseData['quantity'];
                        cell3.innerHTML= firebaseData['price'];
                        cell4.innerHTML = `<i class="ti-trash" id="detailUserStock${i}" type="button"></i>`;
                            let editIcon = document.getElementById(`detailUserStock${i}`),
                                userStockKey = doc.id;
                            editIcon.addEventListener("click", deleteUserStock);
                            editIcon.setAttribute("userId",userKey);
                            editIcon.setAttribute("userStockId",userStockKey);
                    }
                    i++;
                    console.log("Document data:", firebaseData);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            })
    })

}

function deleteUserStock(e){
    
    userKey = e.target.getAttribute('userId');
    userStockKey = e.target.getAttribute('userStockId');
    var docRef = db.collection("users").doc(userKey).collection("mystocks");
    if(userStockKey){
        docRef.doc(userStockKey).delete().then(function(){
            getUserStock(e);
            console.log(`User ${userKey} Stock ${userStockKey} Deleted successfully`);
        })
    }

}

function createStocks(){
    console.log("Creating new Stocks");
    $('#stockName').removeAttr("disabled");
    $('#submit-model').addClass("d-none");
    $('#save-model').removeClass("d-none");
    $('#stockName').val('');
    $('#stockPrice').val('');
    $('#stockChange').val('');
    $('#stockVolume').val('');
}

function saveForm(){
    var sName = $('#stockName').val(),
        sPrice = parseFloat($('#stockPrice').val()),
        sChange = parseFloat($('#stockChange').val()),
        sVolume = parseInt($('#stockVolume').val());
    console.log("create Form");
    db.collection("stocks").add({
    name: sName,
    change:sChange,
    price:sPrice,
    volume:sVolume,
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        $('#stocksModal').modal('hide');

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function fetchStocks(){
    console.log("Fetching new Stocks");
    getStockPrices();
}