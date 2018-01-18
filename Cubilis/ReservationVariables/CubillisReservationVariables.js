<script>
(function(){
// Počakaj, da se vsebina spletne strani naloži, šele potem izvajaj nadaljne operacije
document.addEventListener('DOMContentLoaded', function(){
	var reservationParams = reservation; // "reservation" je globalna spremenljivka, implementirana s strani Cubilisa, v kateri se nahajajo podatki o paketu in sobah
  var roomType;
  var packageType;
  var dataLayer = window.dataLayer || []; // Preverimo, če obstaja spremenljivka dataLayer oziroma jo naredimo če ne obstaja

  // Preveri, ali spremenljivka "reservation" obstaja
  if(typeof(reservationParams) != undefined && reservationParams != null){
    // Check if room type is available
    if (typeof(reservationParams.Rooms) === undefined || reservationParams.Rooms === null) {
        roomType = 'Soba ni izbrana';
    } else {
        roomType = reservationParams.Rooms[0].RoomDescription;
    }

    // Check if package type is available
    if (typeof(reservationParams.Packages) === undefined || reservationParams.Packages === null) {
        packageType = 'Paket ni izbran';
    } else {
        packageType = reservationParams.Packages[0].PackageDescription;
    }
  } else { // Spremenljivka reservation ne obstaja, naredi "scrap" page-a in pridobi podatke
    if (document.getElementsByClassName('row rooms')[0] === undefined) {
      roomType = "";
    } else {
      roomType = document.getElementsByClassName('row rooms')[0].children[0].innerText;
      roomType = roomType.replace(/(\r\n|\n|\r)/gm,'').replace(/\s/g,'-');
    }
  
    if (document.getElementsByClassName('row packages')[0] === undefined) {
      packageType = "";
    } else { 
      packageType = document.getElementsByClassName('row packages')[0].children[0].innerText;
      packageType = packageType.replace(/(\r\n|\n|\r)/gm,'').replace(/\s/g,'-');
    }
  }
  dataLayer.push({
    event: 'Variables Loaded',
    roomDesc: roomType,
    packageDesc: packageType
  });
})
})()
</script>