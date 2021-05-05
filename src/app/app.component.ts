import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  m: number = 6;
  n: number = 6;
  bpGraph;
  title = 'pet-adoption';
  ngOnInit() {
    this.bpGraph = [[false, true, true, false, false, false], [true, false, false, true, false, false],
    [false, false, true, false, false, false], [false, false, true, true, false, false],
    [false, false, false, false, false, false], [false, false, false, false, false, true]]
    console.log(this.maxBPM(this.bpGraph))
  }
  bpm(bpGraph: Array<Array<any>>, u: number, seen: Array<any>, matchR: Array<any>): boolean {
    for (let v = 0; v < this.n; v++) {
      if (bpGraph[u][v] && !seen[v]) {
        seen[v] = true;
        if (matchR[v] < 0 || this.bpm(bpGraph, matchR[v], seen, matchR)) {
          matchR[v] = u;
          return true;
        }
      }
    }
    return false;
  }

  maxBPM(bpGrap: Array<any>) {
    var matchR = new Array(this.n)
    for (let i = 0; i < this.n; i++) {
      matchR[i] = -1;
    }
    var result = 0;
    for (let i = 0; i < this.m; i++) {


      var seen = new Array(this.n)
      for (let j = 0; j < this.n; j++) {
        seen[j] = false;
      }


      if (this.bpm(bpGrap, i, seen, matchR)) result++
    }
    return result
  }
}



