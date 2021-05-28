import { Component, OnInit } from '@angular/core';
import { Adopter } from './models/adopter';
import { Pet } from './models/pet';
import * as Vis from 'vis-network'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  adopters: Adopter[]
  pets: Pet[];
  teste: any[] = []
  adopterLength: number;
  petsLength: number;
  bpGraph: boolean[][];
  connectionsObject = []
  title = 'pet-adoption';
  ngOnInit() {
    this.adopters = [{ id: 0, name: "Guilherme", desiredPet: 'dog', maxAge: 5,}, { id: 1, name: "Rafael", desiredPet: 'dog' , maxAge: 1 }, { id: 2, name: "Vicente", desiredPet: 'dog' , maxAge: 3 }, { id: 3, name: "Ana", desiredPet: 'cat' , maxAge: 1 }, { id: 4, name: "Giovanna", desiredPet: 'bird' , maxAge: 1 }, { id: 5, name: "Antonio", desiredPet: 'cat', maxAge: 2}]
    this.pets = [{ id: 6, name: "Lisa", type: 'cat' , age: 1 }, { id: 7, name: "Zulu", type: 'dog' , age: 1 }, { id: 8, name: "Soya", type: 'cat' , age: 2 }, { id: 9, name: "Branca", type: 'dog' , age: 2 }, { id: 10, name: "Belinha", type: 'dog' , age: 3 }, { id: 11, name: "Sansão", type: 'bird', age: 1}]

    this.adopterLength = this.adopters.length;
    this.petsLength = this.pets.length;

    this.bpGraph = Array(this.adopterLength);
    for (var i = 0; i < this.adopterLength; i++) {
      this.bpGraph[i] = Array(this.petsLength).fill(null);
    }
    this.buildMatrixOfMatches();
    this.maxBPM(this.bpGraph);
    this.buildGraph();
  }

  buildMatrixOfMatches() {
    // finding matching between pets and adopters
    this.adopters.forEach((adopter, lineIndex) => {
      this.pets.forEach((pet, columnIndex) => {
        this.bpGraph[lineIndex][columnIndex] = adopter.desiredPet == pet.type && adopter.maxAge >= pet.age ? true : false
      })
    })
  }

  buildGraph() {
    var nodes = [];
    var edges = [];
    var network = null;
    // create an array with nodes
    let count = 0
    this.adopters.map((e, index) => {
      count += 100
      nodes.push({ id: e.id, label: `Name: ${e.name}\n Desired pet: ${e.desiredPet}\n Max age: ${e.maxAge}`, x: 100, y: index + count })
    })
    count = 0
    this.pets.map((e, index) => {
      count += 100
      nodes.push({ id: e.id, label: `Name: ${e.name}\n type: ${e.type}\n Age: ${e.age}`, x: 600, y: count })
    })

    // create an array with edges
    this.adopters.forEach(adopter => {
      this.pets.forEach(pet => {
        if (adopter.desiredPet == pet.type) {
          edges.push({ from: adopter.id, to: pet.id })
        }
      })
    })


    // create a network
    var container = document.getElementById("mynetwork");
    var data = {
      nodes: nodes,
      edges: edges,
    };
    var options = {
      interaction: {
        dragNodes: false,
      }, physics: {
        enabled: false,
      }
    };
    network = new Vis.Network(container, data, options);
  }
  buildMaximumBipartiteGraph() {
    var nodes = [];
    var edges = [];
    var network = null;
    // create an array with nodes
    let count = 0
    this.adopters.map((e, index) => {
      count += 100
      nodes.push({ id: e.id, label: `Name: ${e.name}\n Desired pet: ${e.desiredPet}\n Max age: ${e.maxAge}`, x: 100, y: index + count })
    })
    count = 0
    this.pets.map((e, index) => {
      count += 100
      nodes.push({ id: e.id, label: `Name: ${e.name}\n type: ${e.type}\n Age: ${e.age}`, x: 600, y: count })
    })

    // create an array with edges
    this.connectionsObject.map(e => {
      edges.push({ from: e.adopterId, to: e.selectedPet })
    })


    // create a network
    var container = document.getElementById("mynetwork");
    var data = {
      nodes: nodes,
      edges: edges,
    };
    var options = {
      interaction: {
        dragNodes: false,
      }, physics: {
        enabled: false,
      }
    };
    network = new Vis.Network(container, data, options);
  }


  // A DFS based recursive function that 
  // returns true if a matching for 
  // vertex u is possible
  bpm(bpGraph: Array<Array<any>>, u: number, seen: Array<any>, adopterIndexMatched: Array<any>): boolean {

    // Try every pet one by one
    for (let v = 0; v < this.petsLength; v++) {
      // If adopter u has a match 
      // in pet v and v is not visited
      if (bpGraph[u][v] && !seen[v]) {
        // Mark v as visited
        seen[v] = true;

        // If pet 'v' is not assigned to
        // an adopter OR previously
        // assigned adopter for pet v (which
        // is adopterIndexMatched[v]) has an alternate pet available.
        // Since v is marked as visited in the 
        // above line, adopterIndexMatched[v] in the following
        // recursive call will not get pet 'v' again
        if (adopterIndexMatched[v] < 0 || this.bpm(bpGraph, adopterIndexMatched[v], seen, adopterIndexMatched)) {
          adopterIndexMatched[v] = u
          // all the possibilities of match between adopters and pets
          // this.teste.push({e: this.adopters[u], x: this.pets[v]})

          return true;
        }
      }
    }
    return false;
  }
  // Returns maximum number 
  // of matching from adopterLength to petLength
  maxBPM(bpGrap: Array<any>) {

    // An array to keep track of the 
    // adopter assigned to pets. 
    // The value of adopterIndexMatched[i] is the 
    // adopter number assigned to pet i, 
    // the value -1 indicates nobody is assigned.
    var adopterIndexMatched = new Array(this.petsLength)

    // Initially all pets are available
    for (let i = 0; i < this.petsLength; i++) {
      adopterIndexMatched[i] = -1;
    }

    // Count of pets assigned to adopters
    let result = 0;
    for (let u = 0; u < this.adopterLength; u++) {

      // Mark all pets as not seen 
      // for next adopter.
      var seen = new Array(this.petsLength)
      for (let j = 0; j < this.petsLength; j++) {
        seen[j] = false;
      }

      // Find if the adopter 'u' can get a pet
      if (this.bpm(bpGrap, u, seen, adopterIndexMatched)) {
        result++
      }
    }
    // with this setup, adopterIndexMatched
    adopterIndexMatched.map((AdopterIndex, petIndex) => {
      this.connectionsObject.push({ adopterId: this.adopters[AdopterIndex]?.id, selectedPet: this.pets[petIndex]?.id })
    })
    return result
  }
}







