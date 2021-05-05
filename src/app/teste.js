function mbp(matrix, isConnected) {
  var N = matrix.length;
  var M = matrix[0].length;
  var visited = new Array(M);
  var matches = new Array(M);
  var res = 0;
  isConnected = isConnected || function(x) {return x;};

  function hasMatch(u) {
    for (var v = 0; v < M; v++) {
      if (isConnected(matrix[u][v]) && !visited[v]) {
        visited[v] = 1;

        if (matches[v] === -1 || hasMatch(matches[v])) {
          matches[v] = u;
          return true;
        }
      }
    }

    return false;
  }

  for (var i = 0; i < M; i++) matches[i] = -1; // initialize

  for (var u = 0; u < N; u++) {
    for (var k = 0; k < M; k++) visited[k] = 0; // reset
    if (hasMatch(u)) res++;
  }

  return res;
}

console.log(mbp([1,2,3,4]))