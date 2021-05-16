import { Component, OnInit } from '@angular/core';
import { Adopter } from './models/adopter';
import { Pet } from './models/pet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  adopter: Adopter[]
  pets: Pet[];
  adopterLength: number;
  petsLength: number;
  bpGraph: boolean[][];
  // value to fill the matrix
  value = null
  title = 'pet-adoption';
  ngOnInit() {
    this.adopter = [{ id: 1, desiredPet: 'cat' }, { id: 2, desiredPet: 'dog' }, { id: 3, desiredPet: 'dog' }, { id: 4, desiredPet: 'dog' }, { id: 5, desiredPet: 'bird' }, { id: 6, desiredPet: 'cat' }]
    this.pets = [{ id: 1, type: 'cat' }, { id: 2, type: 'dog' }, { id: 3, type: 'cat' }, { id: 4, type: 'dog' }, { id: 5, type: 'dog' }, { id: 6, type: 'bird' }]

    this.adopterLength = this.adopter.length;
    this.petsLength = this.pets.length;

    this.bpGraph = Array(this.adopterLength);
    for (var i = 0; i < this.adopterLength; i++) {
      this.bpGraph[i] = Array(this.petsLength).fill(this.value);
    }
    // finding matching between pets and adopters
    this.adopter.forEach((adopter, lineIndex) => {
      this.pets.forEach((pet, columnIndex) => {
        this.bpGraph[lineIndex][columnIndex] = adopter.desiredPet == pet.type ? true : false
      })
    })
    console.log(this.bpGraph)
    console.log(this.maxBPM(this.bpGraph))
  }

  // A DFS based recursive function that 
  // returns true if a matching for 
  // vertex u is possible
  bpm(bpGraph: Array<Array<any>>, u: number, seen: Array<any>, matchR: Array<any>): boolean {

    // Try every job one by one
    for (let v = 0; v < this.petsLength; v++) {
      // If applicant u is interested 
      // in job v and v is not visited
      if (bpGraph[u][v] && !seen[v]) {
        // Mark v as visited
        seen[v] = true;

        // If job 'v' is not assigned to
        // an applicant OR previously
        // assigned applicant for job v (which
        // is matchR[v]) has an alternate job available.
        // Since v is marked as visited in the 
        // above line, matchR[v] in the following
        // recursive call will not get job 'v' again
        if (matchR[v] < 0 || this.bpm(bpGraph, matchR[v], seen, matchR)) {
          matchR[v] = u;
          return true;
        }
      }
    }
    return false;
  }
  // Returns maximum number 
  // of matching from M to N
  maxBPM(bpGrap: Array<any>) {

    // An array to keep track of the 
    // applicants assigned to jobs. 
    // The value of matchR[i] is the 
    // applicant number assigned to job i, 
    // the value -1 indicates nobody is assigned.
    var matchR = new Array(this.petsLength)

    // Initially all jobs are available
    for (let i = 0; i < this.petsLength; i++) {
      matchR[i] = -1;
    }

    // Count of jobs assigned to applicants
    var result = 0;
    for (let i = 0; i < this.adopterLength; i++) {

      // Mark all jobs as not seen 
      // for next applicant.
      var seen = new Array(this.petsLength)
      for (let j = 0; j < this.petsLength; j++) {
        seen[j] = false;
      }

      // Find if the applicant 'u' can get a job
      if (this.bpm(bpGrap, i, seen, matchR)) result++
    }
    return result
  }
}



