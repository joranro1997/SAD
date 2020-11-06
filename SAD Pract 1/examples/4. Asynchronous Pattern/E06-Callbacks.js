function extensa(a, b, c) {
  // Se asume que esta función realizaría alguna tarea
  // prolongada y compleja.

  // Cuando termine, invoca la función c(), comunicando
  // el resultado.
  c(a+b);
}

extensa(4,5, function(x) {
  console.log("El resultado de 'extensa' "
  + "ha sido: " + x);
})

console.log("Terminamos");