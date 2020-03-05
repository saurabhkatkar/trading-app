var db = firebase.firestore();
console.log("Database connection successful",db);
getStockPrices(db);
getUserDetails(db);

function getStockPrices(db){
    var docRef = db.collection("stocks");

    docRef.get().then(function(querySnapshot) {
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
                cell4.innerHTML = '<i class="ti-trash"></i>';
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

function getUserDetails(db){
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
            cell3.innerHTML = '<i class="ti-trash"></i>';
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