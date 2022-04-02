//Set up Firebase
let firebaseConfig = {
    apiKey: "AIzaSyBN3fcjA2ukZigToWw8QIUo2Ufo7zh4Ac4",
    authDomain: "bus-scheduler-4e0ed.firebaseapp.com",
    databaseURL: "https://bus-scheduler-4e0ed.firebaseio.com",
    projectId: "bus-scheduler-4e0ed",
    storageBucket: "bus-scheduler-4e0ed.appspot.com",
    messagingSenderId: "754391315593",
    appId: "1:754391315593:web:c90d6e98fcaa99d1818258"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.database();

//Button for adding buses
$("#add-bus-btn").on("click", function (event) {

    let busName = $("#name-input").val().trim();
    let busDestination = $("#destination-input").val().trim();
    let busTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
    let busFrequency = $("#frequency-input").val().trim();
    let minutesAway;

    if (!/[a-zA-Z][a-zA-Z ]+/.test(busName)) {
        alert('Bus Name needs to be text.');
        return;

    }

    if (!/[0-9]/.test(busFrequency)) {
        alert('Frequency must be a number.');
        return;
    }

    //Creates local "temporary" object for holding bus data
    let newBus = {
        name: busName,
        destination: busDestination,
        time: busTime,
        frequency: busFrequency,
    };

    //Uploads bus data to the database
    database.ref().push(newBus);

    // Logs everything to console
    console.log('new by', newBus);

    alert("Bus successfully added");

    // Clears all of the text-boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

//Create Firebase event for adding buses to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {

    // Store everything into a variable.
    let busName = childSnapshot.val().name;
    let busDestination = childSnapshot.val().destination;
    let busTime = childSnapshot.val().time;
    let busFrequency = childSnapshot.val().frequency;
    let minutesAway = busTime


    // Prettify the busTime
    // let busPrettify = moment.unix(busTime).format("HH:mm");
    let formattedBusTime = moment(busTime, "HH:mm");
    // Calculate difference from arrival and departure
    let currentTime = moment();
    let pastTime = formattedBusTime.subtract(1, 'years');
    let initialTime = currentTime.subtract(pastTime, "minutes");
    let remainder = initialTime % busFrequency;
    minutesAway = busFrequency - remainder;
    let busminutesRemaining = moment().diff(moment(busTime, "X"), "minutes");
    let updatedBusTime = currentTime.add(minutesAway, 'minutes').format("HH:mm");
    // Create the new row
    let newRow = $("<tr>").append(
        $("<td>").text(busName),
        $("<td>").text(busDestination),
        $("<td>").text(busFrequency),
        $("<td>").text(updatedBusTime),
        $("<td>").text(minutesAway)
    );
    console.log(newRow);

    $("#bus-table > tbody").append(newRow);
});
