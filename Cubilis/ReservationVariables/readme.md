# Cubilis - Reservation Variables

Zbiranje specifičnih vrednosti posamezne rezervacije, kot sta tip sobe in tip paketa, po želji tudi druge. Implementacija poteka v 3 korakih:

* [Generiranje spremenljivke reservation](#generiranje-spremenljivka-reservation) (poskrbljeno s strani Cubilisa, je nekoliko buggy)
* [Shranjevanje željenih vrednosti](#shranjevanje-željenih-vrednosti) v lokalne spremenljivke in komunikacija z dataLayer objektom
* [Pošiljanje zbranih podatkov](#pošiljanje-zbranih-podatkov) v Google Analytics


## Generiranje spremenljivke reservation
Sama spremenljivka je zgenerirana s strani Cubilisa. Kadar je dosegljiva globalno, deluje super in ni nobenega problema. Je pa implemenirana na rahlo "nevaren" način.

Trenutna implementacija:

```javascript
var reservation = {...}
```

Bolj varen način implementacije:

```javascript
window.reservation = {...}

oziroma

var reservation = {...}
window.reservation = reservation
```

Na slednji način je spremenljivka reservation zapisana v "scope" window objekta, torej je vedno dosegljiva tudi GoogleTagManager-ju.

Najboljši način pa bi sicer bil, da se podatki, ki so zapisani v spremenljivki reservation, pošljejo direktno v dataLayer in so tako navoljo GTMju:

```javascript
var reservation = {...};
var dataLayer = window.dataLayer || [];

dataLayer.push({
	event: 'ReservationVarsLoaded',
	reservationData: reservation
});
```

## Shranjevanje željenih vrednosti

Da lahko do vrednosti spremeljivke `reservation` dostopamo znotraj GTMja, moramo najprej narediti nov **Tag** tipa **Custom HTML**. Vanj vnesemo kodo, ki se nahaja v tej mapi (glej zgoraj). Koda je razložena s komentarji, na kratko delovanje kode še tu:

Ker ustvarjamo custom HTML, kar ne pomeni nič drugega, kot da bo GTM vstavil nek kos html kode na stran, moramo najprej zaviti vse v `<scirpt></script>` značko. Želimo poklicati funkcijo in želimo je poklicati avtomatsko, torej moramo narediti funkcijo tipa:

```javascript
(function(){})()
``` 
Ta tip funkcije se avtomatsko pokliče in izvede, kar tudi želimo.

Shranimo globalno spremeljivko `reservation` v lokalno npr `reservationData` in sicer preverimo, ali je spremenljivka `reservation` na voljo na način: `var reservationData = typeof(reservation) == "undefined" ? null : reservation`. Zastavimo spremenljivki `var roomType;` in `var packageType;`, da bosta dosegljivi v področju funkcije.

Sledi glavni `if(){} else{}`, ki je trenutno potreben zaradi varnosti v primeru, da spremenljivka `reservation` ni dosegljiva. Preverimo:

```javascript
if(typeof(reservationData) != "undefined" && reservationData != null){
	// imamo podatke spremenljivke reservation, lahko operiramo z njimi
}
else {
	// podatki iz spremenljivke reservation niso dosegljivi, potrebno je scrappanje strani
}
```

V primeru, da so se podatki spremenljivke `reservation` ustrezno naložili, nam ostane le še, da preverimo, ali je izbrana soba in/ali je izbran paket, in nastavimo prej določene spremenljivke roomType in packageType na vrednost iz te spremenljivke. To izgleda tako:

```javascript
// Določanje tipa sobe
if(typeof(reservationData.Rooms) === "undefined" || reservationData.Rooms === null) {
	roomType = 'Soba ni izbrana';
}
else {
	roomType = reservationData.Rooms[0].RoomDescription;
}

// Določanje tipa paketa
if(typeof(reservationData.Packages) === "undefined" || reservationData.Packages === null) {
	packageType = 'Paket ni izbran';
}
else {
	packageType = reservationData.Packages[0].PackageDescription;
}
```
V primeru, da podatki spremenljivke `reservation` niso dosegljivi, pa je potrebno podatke potegniti iz spletne strani prek DOM elementov. To je bolj specifičen postopek, ki se razlikuje od strani do strani in ne obstaja neko generično pravilo.

Vse kar moramo še narediti je, da v dataLayer pošljemo filtrane podatke o rezervaciji. To naredimo tako:

```javascript
var dataLayer = window.dataLayer || [];
dataLayer.push({
	event: 'Variables Loaded',
	roomDesc: roomType,
	packageDesc: packageType
});
```

Te spremenljivke so nam sedaj dosegljive znotraj GTM.

## Pošiljanje zbranih podatkov

Da zbrane podatke ustrezno pošljemo v GA, najprej znotraj GTM naredimo 2 novi **Variables** in sicer izberemo tip **Data Layer Variable** in v polje vnesemo roomDesc oziroma packageDesc. Tako znotraj GTMja shranimo referenco na te spremenljivke.

Za pošiljanje v GA ustvarimo nov UA Tag, in ga nastavimo glede na potrebe. Glavno je to, da sta nam spremenljivki o sobi in paketu sedaj dostopni znotraj tega Tag-a, ki bo komuniciral z GA.