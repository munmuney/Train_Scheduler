  //----------Initializing Firebase----------//
  var config = {
    apiKey: "AIzaSyCGLwVI9mPQudk-0OsROT6IFCGVHbFGq_o",
    authDomain: "train-scheduler-bae6c.firebaseapp.com",
    databaseURL: "https://train-scheduler-bae6c.firebaseio.com",
    projectId: "train-scheduler-bae6c",
    storageBucket: "train-scheduler-bae6c.appspot.com",
    messagingSenderId: "800570570950"
  };

  firebase.initializeApp(config);
  //----------variable to reference the database----------//

  var database = firebase.database();

  //----------Initial Variable----------//
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;



  //==========Submit Button==========//
  $("#submit").on("click", function() {

  //-----Grab values and store into a variable-----//
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();
    
    console.log("-----Button Pressed-----")
    console.log("First Time: " + firstTrainTime);

   
    //-----First Time (pushed back 1 year to make sure it comes before current time)-----//
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log("FTC: " + firstTimeConverted);

    //-----Difference between the times-----//
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    //-----Time apart (remainder)-----//
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    //-----Minute Until Train-----//
    minutesAway = frequency - tRemainder;
    console.log("Minutes away: " + minutesAway);

    //-----Next Train Time-----//
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

    //-----Arrival Time-----//
    nextArrival = moment(nextTrain).format("hh:mm A");



    //=====Pushes the data into firebase=====//
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
      // minutesAway: minutesAway,
      // nextArrival: nextArrival,
    });
    
    alert("Form submitted!"); //(modal)

    //-----empty textboxes-----//
    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");
    
    //-----prevent from refreshing-----//
    return false; 

    // Prevent default behavior
    event.preventDefault();

  });

 //var trainUpdate = function() {
 //^^^^Trying to auto refresh the nextArrival and minutesAway


  // initial loader
  database.ref().on("child_added", function(snapshot) {

    console.log("-----Child Appended-----");
    console.log("Name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("Train Time: " + snapshot.val().firstTrainTime);
    console.log("Frequency: " + snapshot.val().frequency);
    // console.log("Next Arrival: " + snapshot.val().nextArrival);
    // console.log("Minutes Away: " + snapshot.val().minutesAway);
    console.log("===================");
    
    //-----Grabbing data from database and store into variable-----//
    var traintime = snapshot.val().firstTrainTime;
    var frequency = snapshot.val().frequency;

    
    //-----First Time (pushed back 1 year to make sure it comes before current time)-----//
    var firstTimeConverted = moment(traintime, "hh:mm").subtract(1, "years");
    console.log("FTC: " + firstTimeConverted);

    //-----Difference between the times-----//
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    //-----Time apart (remainder)-----//
    var tRemainder = diffTime % frequency;
    console.log("R: " + tRemainder);

    //-----Minute Until Train-----//
    minutesAway = frequency - tRemainder;
    console.log("Minutes away: " + minutesAway);

    //-----Next Train Time-----//
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

    //-----Arrival Time-----//
    nextArrival = moment(nextTrain).format("hh:mm A");



  //----------add data to html----------//
    var row = $("<tr>");

    var putName = $("<th>");
    putName.append(snapshot.val().trainName);

    var putDestination = $("<th>");
    putDestination.append(snapshot.val().destination);

    var putFreq = $("<th>");
    putFreq.append(snapshot.val().frequency);

    var putArrival = $("<th>");
    putArrival.append(nextArrival);

    var putMinAway = $("<th>");
    putMinAway.append(minutesAway);


    row.append(putName, putDestination, putFreq, putArrival, putMinAway);


    $("#data").append(row);

    //-----Handle the errors-----//
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

//};

 //-----Current Time-----// 
var update = function () {
    date = moment(new Date())
    currentTime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};



$(document).ready(function(){
    currentTime = $('#currentTime')
    update();
    setInterval(update, 1000);

    //setInterval(trainUpdate,1000); // trying to auto refresh 

});