import { Component, OnInit } from '@angular/core';
import { Adopter } from './models/adopter';
import { Pet } from './models/pet';

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
  obj = Array(6).fill(null)
  // value to fill the matrix
  value = null
  title = 'pet-adoption';
  ngOnInit() {
    this.adopters = [{ id: 0, desiredPet: 'cat' }, { id: 1, desiredPet: 'dog' }, { id: 2, desiredPet: 'dog' }, { id: 3, desiredPet: 'dog' }, { id: 4, desiredPet: 'bird' }, { id: 5, desiredPet: 'cat' }]
    this.pets = [{ id: 0, type: 'cat' }, { id: 1, type: 'dog' }, { id: 2, type: 'cat' }, { id: 3, type: 'dog' }, { id: 4, type: 'dog' }, { id: 5, type: 'bird' }]

    this.adopterLength = this.adopters.length;
    this.petsLength = this.pets.length;

    this.bpGraph = Array(this.adopterLength);
    for (var i = 0; i < this.adopterLength; i++) {
      this.bpGraph[i] = Array(this.petsLength).fill(this.value);
    }
    // finding matching between pets and adopters
    this.adopters.forEach((adopter, lineIndex) => {
      this.pets.forEach((pet, columnIndex) => {
        this.bpGraph[lineIndex][columnIndex] = adopter.desiredPet == pet.type ? true : false
      })
    })
    console.log(this.maxBPM(this.bpGraph))
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
     console.log(this.adopters[AdopterIndex],this.pets[petIndex])
    })
    return result
  }
}



