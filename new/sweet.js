syntax hi = function(ctx) {
  return #`console.log("hello, world!");`;
}

hi

syntax new = function (ctx) {
  let ident = ctx.next().value;
  let params = ctx.next().value;
  return #`${ident}.create ${params}`;
}

new Droid('BB-8', 'orange');

syntax $ = function(ctx) {
  let ident = ctx.next().value;
  let params = ctx.next().value;

  //return #`.bind(${method})(${params})`;
  return #`bind(${ident})`;
}

"foo" $ capitalize();

