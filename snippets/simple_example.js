// if you don't specify a html file, the sniper will generate a div
var app = require("biojs-vis-circularfv");

var myCircularFeatureViewer = new app({
  target: yourDiv.id,
  sequence:'MTAVFRVGLVRLVSRATQSPNLLQAQTNALPAAFQQRCSISGKTMRGGPRVPKAAPYPYKTKKYSVFNAIFDKTSKRFDENSKVICVEGPIAAGKSKFAKELAEELDMEYYPAVDLDLIYINSYGYDMRKLDPQLPPSCRSYDVRNFCLDPSHDLAAQFQIRMYMLRYSQYIDALQHVLSTGQGVVLERSPYSDFVFMEAMFRQGYLSRGARSVYNELRQNTIGELLKPHLVIYLDLPVDAVKKQIKARNVDYEVQSKVFSDAYLSDLEQLYKQQYLKDISTHAELLIYDWTAGGETEVVVEDIERIDFNQFEADIHNKKMLDWRFPLEAEWCEARIKYCHEKPDLMNYFNVPRFDVPELVRSADDGKVWRDVWFNAPGMKYRPGYNADMGDEGLLTKTKIGINQGI',
  features:[
  { "id": 0, "start": 19, "stop": 305, "type": "voluptate", "color":"green" },
  { "id": 1, "start": 143, "stop": 283, "type": "non", "color":"red"},
  { "id": 2, "start": 76, "stop": 238, "type": "voluptate", "color":"blue" }, 
    { "id": 3, "start": 355, "stop": 12, "type": "sit" }, 
    { "id": 4, "start": 125, "stop": 206, "type": "et" }, 
      { "id": 5, "start": 253, "stop": 136, "type": "proident" }
  ],
  width:715,
  height:505
});
