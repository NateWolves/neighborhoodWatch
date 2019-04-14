

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB6mZbWdxhmLw4fuxedbn_3P5z4k-IuSV0",
    authDomain: "neighborhood-watch-4cada.firebaseapp.com",
    databaseURL: "https://neighborhood-watch-4cada.firebaseio.com",
    projectId: "neighborhood-watch-4cada",
    storageBucket: "neighborhood-watch-4cada.appspot.com",
    messagingSenderId: "674484382230"
  };
  firebase.initializeApp(config);
  const database = firebase.database();
  
  let userName;
  let zipCode = 64105;
  var markerArray = [];
  var oldMarkers= [];
  var map;
  var infoWindow;
  var signedOn = false;
  var databaseZip;
  let userMarkerMessage= "default"

// Setting up a username with local storage
// userName = localStorage.getItem("userName")
$("#signIn").on("click", function(){
  // launch sign in modal
  $("#signInModal").modal('show')
});
$("#submitUsername").on("")
// localStorage.setItem("userName", userName);
var query = database.ref(databaseZip)
query.on("value", function(snapshot) {
  // Log everything that's coming out of snapshot
  
  let childData = snapshot.val();
  
  let dbMarkers = Object.values(childData[zipCode].Markers)
  
  console.log(dbMarkers)
  dbMarkers.forEach(Markers => {
    let results = {Markers};
    markerArray.push(results);
  });
   // adding all of our Markers to the map 
   console.log(markerArray)
   console.log(oldMarkers)
  reloadMarkers();
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


function reloadMarkers() {
  for (let h = 0; h < oldMarkers.length; h++){
    oldMarkers[h].setMap(null);
    }
  oldMarkers = [];
  for (let i = 0; i < markerArray.length ; i++){  
    addMarker(markerArray[i])
    }
};

 // function that adds markers given coordinates, and iconImage
 function addMarker(props){
  var marker = new google.maps.Marker({
     position: props.Markers.coords,
     map: map,
     draggable: true,
     animation: google.maps.Animation.DROP,

   });
   // Checking for a custom icon
   if(props.Markers.iconImage){
     // Setting icon image
     marker.setIcon(props.Markers.iconImage);
   }
   // Check if there is additional content
   if(props.Markers.content){
     var infoWindow = new google.maps.InfoWindow({
       content: props.Markers.content
     });
     marker.addListener('click', function(){
      infoWindow.open(map, marker);
   })
  }
  oldMarkers.push(marker);
};
  
function initMap(){
    // map options
     var options ={
      center: {lat: 39.0997, lng: -94.5786},
      zoom: 16,
      // Give the map a night style
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
     }
     markerArray = [
      {Markers:{
        coords: {lat:39.0995, lng: -94.5780},
        // iconImage:'images/005-exit',
        content:'<h3>Activity1<h3>'
      }},
      { Markers:{
        coords: {lat:39.1000, lng: -94.5782},
        // iconImage:'images/011-group',
        content:'<h3>Criminal Activity2<h3>'
      }},
      {Markers:{
      coords: {lat:39.0998, lng: -94.5784},
      // iconImage:"",
      content:'<h3>Suspicious  Activity3<h3>'
      }},
    ];

    //  New map
     map = new 
    google.maps.Map(document.getElementById('googleMap'), options);
    var geocoder = new google.maps.Geocoder();
    // listen for click on map
    google.maps.event.addListener(map, 'click', function(event) {
      // geocoding the map click to return its zip code
      // geocoder.geocode({
      //   'latLng': event.latLng
      // }, function(results, status) {
      //   if (status == google.maps.GeocoderStatus.OK) {
      //     if (results[0]) {
      //       console.log(results);
      //       let zipCode = results[0].address_components[7].short_name;
      //       console.log(zipCode);
      //     }
      //   }
      // });
    
      // Launch modal for getting the data to add our marker to the database
     
      $("#markerModal").modal('show');
      $("#submitMarker").on('click', function(e){
        e.preventDefault();
        userMarkerMessage = $("#message-text").val().trim()
        
        $('#message-text').val("")
        $("#markerModal").modal('hide')
        // let chosenPicture = "assets/images/icons/bicycling.svg";
        let image = {
          
          url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag',
          // // This marker is 20 pixels wide by 32 pixels high.
          // size: new google.maps.Size(20, 32),
          // // The origin for this image is (0, 0).
          // origin: new google.maps.Point(0, 0),
          // // The anchor for this image is the base of the flagpole at (0, 32).
          // anchor: new google.maps.Point(0, 32)
        };
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();
        let coords = {lat:lat , lng: lng};
        let newMarker = {coords: coords,
          content: userMarkerMessage,
          iconImage: image};
        console.log(newMarker)
             // adding markers to the database
        databaseZip = "/" + zipCode;      
        database.ref(databaseZip + "/Markers").push(newMarker);  
        })
      });
}




$("#geocodeButton").on('click', function(event){
//prevent form submit
  event.preventDefault();
  
  zipCode = $("#inputZip").val().trim();
  
  if(zipCode.length === 5 && parseInt(zipCode) !== NaN){
// searching google maps api with a zip code (or address) for coordinates
   axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
     params: {
       address: zipCode, 
       key:'AIzaSyCV5fLzBC8q8GbS163UxAiHAZlcEHenxvI'
     }
   })
   .then(function(response){
     // Using our location data  
     let lat = response.data.results[0].geometry.location.lat;
     let lng = response.data.results[0].geometry.location.lng;
     let coords = {lat: lat, lng: lng};
     map.setCenter(coords);
   })
   .catch(function(error){
     console.log(error);
   });
   $("#inputZip").val("");
   $("#currentZip").text(zipCode)
  }
   else {
    alert("Please use a zip code.")
  }
});

// launching our Google Map
initMap();
$("#currentZip").text(zipCode)




// Chat Room
// var config = {
//   authDomain: "https://rudimentary-chatroom.firebaseio.com/",
//   databaseURL: "https://rudimentary-chatroom.firebaseio.com/",
// };



// firebase.initializeApp(config);

// var chat;

// var chatMessage;            


// $("#add-chat").on("click", function(event) {
//   // event.preventDefault() prevents the form from trying to submit itself.
//   // We're using a form so that the user can hit enter instead of clicking the button if they want
//   event.preventDefault();

//   // This line will grab the text from the input box
//   chatMessage = $("#chat-input").val().trim();
//   chat.push(chatMessage);

//   if (chat.length > 10) {
//       chat.shift();
//   }

//   database.ref().set({
//       chat:chat
//   });
// });



// console.log(database.val);

// database.ref().on("value", function(snapshot) {

//   // Log everything that's coming out of snapshot
//   console.log(snapshot.val());
//   chat = snapshot.val().chat;
  

//   $("#chat").html("<p>" + chat.join("</p><p>") + "</p>");

//   // Handle the errors
// }, function(errorObject) {
//   console.log("Errors handled: " + errorObject.code);
// });




// database.ref().set({
//       chat:chat
// });
let iconURL =  "http://maps.google.com/mapfiles/ms/micons/"

const iconList = `POI
arts
bar
blue-dot
blue-pushpin
blue
bus
cabs
camera
campfire
campground
caution
coffeehouse
convienancestore
cycling
dollar
drinking_water
earthquake
electronics
euro
fallingrocks
ferry
firedept
fishing
flag
gas
golfer
green-dot
green
grn-pushpin
grocerystore
groecerystore
helicopter
hiker
homegardenbusiness
horsebackriding
hospitals
hotsprings
info
info_circle
landmarks-jp
lightblue
lodging
ltblu-pushpin
ltblue-dot
man
marina
mechanic
motorcycling
movies
orange-dot
orange
parkinglot
partly_cloudy
pharmacy-us
phone
picnic
pink-dot
pink-pushpin
pink
plane
police
postoffice-jp
postoffice-us
purple-dot
purple-pushpin
purple
question
rail
rainy
rangerstation
realestate
recycle
red-dot
red-pushpin
red
restaurant
sailing
salon
shopping
ski
snack_bar
snowflake_simple
sportvenue
subway
sunny
swimming
toilets
trail
tram
tree
truck
volcano
water
waterfalls
webcam
webcam.shadow
wheel_chair_accessible
woman
yellow-dot
yellow
yen
ylw-pushpin`

//Todo:  add on clicks for icons
let iconArray = iconList.split(`
`);


iconArray.forEach(image =>{
  let img = $("<img>").attr("class", "mapIcon");
  let newImageURL = iconURL + image + ".png"
  img.attr('src', newImageURL)
  $("#selectIcon").append(img)
});