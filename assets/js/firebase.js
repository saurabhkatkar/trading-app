var db = firebase.firestore();
console.log("Database connection successful",db);
getStockPrices();
getUserDetails();


function submitForm(){
    var stockName =  $('#stockName').val(),
        stockPrice =  $('#stockPrice').val(),
        stockChange =  $('#stockChange').val(),
        stockVolume =  $('#stockVolume').val();
    
    var sfDocRef = db.collection("stocks").doc(stockName);
    db.runTransaction(function(transaction) {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(sfDocRef).then(function(sfDoc) {
        if (!sfDoc.exists) {
            throw "Document does not exist!";
        }
        transaction.update(sfDocRef, { price: stockPrice, change: stockChange, volume: stockVolume });
    });
    }).then(function() {
        console.log("Transaction successfully committed!");
        $('#stocksModal').modal('hide');
    }).catch(function(error) {
        console.log("Transaction failed: ", error);
    });

    

}

function editButtonClicked(e){
     var modal = document.getElementById('model-form');
    var key = e.target.getAttribute('stockid');
    var docRef = db.collection("stocks").doc(key);
    docRef.get().then(function(doc){
         if (doc.exists) {
             data = doc.data();
             $('#stockName').val(data['Name']);
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

function removeTableItems(){
     var tableLength = document.getElementById('admin-table').rows.length;    
    if (tableLength > 1 ){
        for(var i = tableLength; i > 1;i--){
         document.getElementById("admin-table").deleteRow(i-1);
        }
    }
    else{
        console.log('Empty Table');
    }
}
function getStockPrices(){
    var docRef = db.collection("stocks");

    docRef.onSnapshot(function(querySnapshot) {
        removeTableItems();
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
            if(firebaseData){
                cell0.outerHTML= `<th scope="row"> ${i} </th>`;
                cell1.innerHTML= firebaseData['Name'].toUpperCase();
                cell2.innerHTML= firebaseData['price'];
                cell3.innerHTML= firebaseData['change'];
                cell4.innerHTML = `<i class="ti-pencil-alt" id="edit-stock${i}" data-toggle="modal" data-target="#stocksModal" type="button"></i>`;
                let editIcon = document.getElementById(`edit-stock${i}`),
                    key = firebaseData['Name'];
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
        if(firebaseData){
            cell0.outerHTML= `<th scope="row"> ${i} </th>`;
            cell1.innerHTML= firebaseData['username'].toUpperCase();
            cell2.innerHTML= firebaseData['email'];
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

